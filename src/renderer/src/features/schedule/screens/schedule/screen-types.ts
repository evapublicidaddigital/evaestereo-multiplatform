import type { ScheduleModel } from "../../data/models";
import type { PublicJob, VoiceType } from "../../services/types";

export type ScreenContextType = {
  schedules: ScheduleModel[];
  activate: (schedule: ScheduleModel, voice: VoiceType) => void;
  turnOff: (scheduleId: string) => void;
  playing: PublicJob | null;
  queued: PublicJob[];
  handleSelectAudio: (audio: ScheduleModel) => void;
  text: string;
  setText: (text: string) => void;
};
