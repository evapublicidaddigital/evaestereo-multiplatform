// AudioScheduler.ts — core logic with a single timer and one <audio> element.

import type {
  Job,
  MediaFileModel,
  PublicJob,
  ScheduleModel,
  VoiceType,
} from "./types";

type Listener = (snapshot: {
  playing: PublicJob | null;
  queued: PublicJob[];
}) => void;

export class AudioScheduler {
  private queue: Job[] = []; // sorted by nextRunAt, activatedAt
  private playing: Job | null = null;
  private audio: HTMLAudioElement | null = null;
  private timer: number | NodeJS.Timeout | null = null;
  private listeners = new Set<Listener>();

  // --- Public API ----
  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    // push initial state
    cb(this.snapshot());
    return () => this.listeners.delete(cb);
  }

  getActiveJobs(): { playing: PublicJob | null; queued: PublicJob[] } {
    return this.snapshot();
  }

  /** Activate a schedule with a chosen voice. */
  activate(schedule: ScheduleModel, voice: VoiceType): void {
    const media = this.pickMedia(schedule, voice);
    if (!media) {
      console.warn(
        `No media of type "${voice}" for schedule "${schedule.name}"`,
      );
      return;
    }

    const intervalMs = Math.max(0, (schedule.interval ?? 0) * 60_000);
    const remainingPlays = schedule.loop
      ? Number.POSITIVE_INFINITY
      : Math.max(0, schedule.duration ?? 0);

    if (remainingPlays === 0) return;

    const now = Date.now();
    const job: Job = {
      jobId: `${schedule.id}::${media.url}`,
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      code: schedule.code,
      name: schedule.name,
      interval: schedule.interval.toString(),
      duration: schedule.duration.toString(),
      media,
      intervalMs,
      activatedAt: now,
      nextRunAt: now, // start ASAP
      remainingPlays,
      canceled: false,
    };

    this.enqueue(job);

    // If nothing is playing and this job is due now, start it immediately.
    if (!this.playing && job.nextRunAt <= Date.now()) {
      this.maybeStartNext();
    } else {
      this.resetTimer();
    }
    this.emit();
  }

  /** Turn off everything for a schedule: remove from queue; if playing, let it finish but don't requeue. */
  turnOff(scheduleId: string): void {
    // Drop all future occurrences
    this.queue = this.queue.filter((j) => j.scheduleId !== scheduleId);

    // If current matches, mark canceled so it won't requeue on end
    if (this.playing?.scheduleId === scheduleId) {
      this.playing.canceled = true;
    }

    this.resetTimer();
    this.emit();
  }

  /** Clear all state; useful on app shutdown/unmount. */
  dispose(): void {
    if (this.timer) {
      clearTimeout(this.timer as unknown as number);
      this.timer = null;
    }
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.queue = [];
    this.playing = null;
    this.listeners.clear();
  }

  // --- Internals ----
  private pickMedia(schedule: ScheduleModel, voice: VoiceType): MediaFileModel {
    const exact = schedule.media_urls.find((m) => m.type === voice);
    return exact ?? schedule.media_urls[0]; // fallback to first if not found
  }

  private enqueue(job: Job): void {
    this.queue.push(job);
    this.sortQueue();
  }

  private sortQueue(): void {
    this.queue.sort(
      (a, b) => a.nextRunAt - b.nextRunAt || a.activatedAt - b.activatedAt,
    );
  }

  private resetTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer as unknown as number);
      this.timer = null;
    }
    // Only schedule if nothing is playing
    if (this.playing) return;

    const next = this.queue[0];
    if (!next) return; // nothing to do

    const delay = Math.max(0, next.nextRunAt - Date.now());
    this.timer = setTimeout(() => {
      this.timer = null;
      this.maybeStartNext();
    }, delay);
  }

  private maybeStartNext(): void {
    if (this.playing) return; // still busy

    const now = Date.now();
    const dueIdx = this.queue.findIndex((j) => j.nextRunAt <= now);
    if (dueIdx === -1) {
      // nothing ready yet; ensure timer is set for earliest
      this.resetTimer();
      return;
    }

    const job = this.queue.splice(dueIdx, 1)[0];
    this.startJob(job);
  }

  private startJob(job: Job): void {
    this.playing = job;

    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = "auto";
    }

    // Prepare handlers every time to capture current job
    this.audio.onended = () => this.onAudioEnded();
    this.audio.onerror = () => this.onAudioError();

    // Start
    this.audio.src = job.media.url;
    // Avoid overlapping play() promises rejections
    void this.audio.play().catch((err) => {
      console.error("Audio play error:", err);
      this.onAudioEnded(); // treat as finished to keep queue moving
    });

    this.emit();
  }

  private onAudioEnded(): void {
    const finished = this.playing;
    this.playing = null;

    if (!finished) {
      this.resetTimer();
      this.emit();
      return;
    }

    // If user turned it off mid-play, do not re-enqueue.
    if (!finished.canceled) {
      // Decrement remaining plays (unless infinite)
      if (finished.remainingPlays !== Number.POSITIVE_INFINITY) {
        finished.remainingPlays = Math.max(0, finished.remainingPlays - 1);
      }

      if (finished.remainingPlays > 0) {
        // Schedule the next run AFTER the clip finished (now)
        finished.nextRunAt = Date.now() + finished.intervalMs;
        this.enqueue(finished);
      }
    }

    this.maybeStartNext(); // if something else is due, play it; otherwise set timer
    this.emit();
  }

  private onAudioError(): void {
    console.error("Audio error, skipping this run.");
    // Treat like ended but do NOT re-enqueue the same run immediately.
    this.onAudioEnded();
  }

  private snapshot(): { playing: PublicJob | null; queued: PublicJob[] } {
    const playing: PublicJob | null = this.playing
      ? {
          jobId: this.playing.jobId,
          scheduleId: this.playing.scheduleId,
          scheduleName: this.playing.scheduleName,
          code: this.playing.code,
          name: this.playing.name,
          interval: this.playing.interval,
          duration: this.playing.duration,
          mediaUrl: this.playing.media.url,
          voiceType: this.playing.media.type,
          status: "playing",
          remainingPlays: this.playing.remainingPlays,
        }
      : null;

    const queued: PublicJob[] = this.queue.map((j) => ({
      jobId: j.jobId,
      scheduleId: j.scheduleId,
      scheduleName: j.scheduleName,
      code: j.code,
      name: j.name,
      interval: j.interval,
      duration: j.duration,
      mediaUrl: j.media.url,
      voiceType: j.media.type,
      status: "queued",
      nextRunAt: j.nextRunAt,
      remainingPlays: j.remainingPlays,
    }));

    return { playing, queued };
  }

  private emit(): void {
    const snap = this.snapshot();
    this.listeners.forEach((cb) => cb(snap));
  }
}
