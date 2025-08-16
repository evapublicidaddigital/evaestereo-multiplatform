import type { MediaDto } from "../dto";
import type { MediaModel } from "../models/media-model";

export const mediaMapper = (data: MediaDto): MediaModel => {
  console.log("data", data);
  return {
    put_url: data.put_url,
    resource_url: data.resource_url,
  };
};
