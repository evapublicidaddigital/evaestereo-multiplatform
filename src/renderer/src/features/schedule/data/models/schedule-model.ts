export interface MediaFileModel {
  url: string;
  type: "male" | "female";
  file?: File;
}

export type TypeScheduleModel = {
  id: string;
  name: string;
};

export type ScheduleModel = {
  id: string;
  name: string;
  interval: number;
  duration: number;
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

export type ScheduleFormPostModel = {
  name: string;
  interval: number;
  duration: number;
  code: string;
  loop: boolean;
  country_name: string;
  country_id: number;
  state_name: string;
  state_id: number;
  city: string;
  city_id: number;
  type_schedule_id: string;
  client_id: string;
  media_urls: MediaFileModel[];
};

export type ScheduleResponseModel = {
  schedules: ScheduleModel[];
  nextToken?: string;
};

export type TypeScheduleResponseModel = {
  typeSchedules: TypeScheduleModel[];
  nextToken?: string;
};

export type TypeScheduleParamsModel = {
  name?: string;
  limit?: number;
  nextToken?: string;
};

export type ScheduleParamsModel = {
  name?: string;
  limit?: number;
  nextToken?: string;
  type_schedule_id: string;
  country_id: number;
  state_id: number;
  client_id?: string;
};

export type ScheduleAudioModel = {
  url: string;
  name: string;
  type: "male" | "female";
};
