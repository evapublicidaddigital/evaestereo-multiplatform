// types.ts — your models (as provided), plus runtime types we use here.

export interface MediaFileModel {
  url: string;
  type: "male" | "female";
  file?: File;
}

export type ScheduleModel = {
  id: string;
  name: string;
  interval: number; // minutes
  duration: number; // number of times to play
  code: string;
  loop: boolean;
  country_name: string;
  country_id: number;
  state_name: string;
  state_id: number;
  city_name: string;
  city_id: number;
  type_schedule_id: string;
  client_id: string;
  media_urls: MediaFileModel[];
};

// ---- scheduler runtime types ----
export type VoiceType = "male" | "female";

export type Job = {
  jobId: string; // scheduleId + media url for uniqueness
  scheduleId: string;
  scheduleName: string;
  code: string;
  name: string;
  interval: string;
  duration: string;
  media: MediaFileModel;
  intervalMs: number;
  activatedAt: number; // tie-breaker to preserve FIFO among same nextRunAt
  nextRunAt: number; // epoch ms
  remainingPlays: number; // Infinity if loop
  canceled: boolean; // set to true when user "turns off"
};

export type PublicJob = {
  jobId: string;
  scheduleId: string;
  scheduleName: string;
  code: string;
  name: string;
  interval: string;
  duration: string;
  mediaUrl: string;
  voiceType: VoiceType;
  status: "playing" | "queued";
  nextRunAt?: number; // only for queued
  remainingPlays: number; // Infinity => Number.POSITIVE_INFINITY
};

export type PlayEvents = {
  onEnded: () => void;
  onError: (err: Error) => void;
};

export interface PlayerPort {
  play(url: string, ev: PlayEvents): Promise<void>; // resolves once playback actually starts
  stop?(): Promise<void>; // optional
  setVolume?(v: number): void; // 0..1 (optional)
  setDuckingEnabled?(enabled: boolean): void; // optional
}
