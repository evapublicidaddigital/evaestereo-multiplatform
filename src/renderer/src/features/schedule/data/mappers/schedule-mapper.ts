import type { ScheduleDto, TypeScheduleDto } from "../dto/schedule-dto";
import type {
  ScheduleModel,
  TypeScheduleModel,
} from "../models/schedule-model";

export const scheduleMapper = (data: ScheduleDto[]): ScheduleModel[] => {
  return data.map((item) => ({
    id: item.sk.split("#")[1],
    name: item.name,
    interval: item.interval,
    duration: item.duration,
    code: item.code,
    loop: item.loop,
    country_name: item.country_name,
    country_id: item.country_id,
    state_name: item.state_name,
    state_id: item.state_id,
    city_name: item.city_name,
    city_id: item.city_id,
    type_schedule_id: item.type_schedule_id,
    client_id: item.client_id,
    media_urls: item.media_urls,
  }));
};

export const typeScheduleMapper = (
  data: TypeScheduleDto[]
): TypeScheduleModel[] => {
  return data.map((item) => ({
    id: item.sk.split("#")[1],
    name: item.name,
  }));
};
