import type { ScheduleModel } from "../../data/models";
import type { PublicJob, VoiceType } from "../../services/types";

export type ScreenContextType = {
  schedules: ScheduleModel[];
  playing: PublicJob | null;
  queued: PublicJob[];
  open: boolean;
  text: string;
  value: number;
  bottomValue: number;
  isFetching: boolean;
  turnOff: (scheduleId: string) => void;
  activate: (schedule: ScheduleModel, voice: VoiceType) => void;
  handleSelectAudio: (audio: ScheduleModel) => void;
  setText: (text: string) => void;
  setValue: (value: number) => void;
  setBottomValue: (value: number) => void;
  setOpen: (open: boolean) => void;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  handleClose: () => void;
  handleSync: () => void;
};
