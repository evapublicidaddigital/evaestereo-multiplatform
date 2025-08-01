export interface MediaFileDto {
  url: string;
  type: "male" | "female";
}

export type ScheduleDto = {
  pk: string;
  sk: string;
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
  media_urls: MediaFileDto[];
};

export type TypeScheduleDto = {
  pk: string;
  sk: string;
  name: string;
};

export type ScheduleDtoPost = {
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
  media_urls: MediaFileDto[];
};

export type TypeScheduleDtoPost = {
  id: string;
  name: string;
};
