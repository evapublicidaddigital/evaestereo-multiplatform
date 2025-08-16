import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MediaDto, MediaPostDto } from "../dto";
import { mediaMapper } from "../mappers/media-mapper";
import type { MediaModel } from "../models/media-model";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  refetchOnReconnect: true,
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_URL_MEDIA_CONTENT,
    timeout: 30 * 1000,
    credentials: "include",
  }),
  endpoints: (build) => ({
    getUrlToUploadMedia: build.mutation<MediaModel, MediaPostDto>({
      query: (data) => ({
        url: "resources",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: MediaDto) => {
        console.log("response", response);
        return mediaMapper(response);
      },
    }),
    putSingleUrlMedia: build.mutation<void, { url: string; file: File }>({
      query({ url, file }) {
        return {
          url,
          method: "PUT",
          body: file,
        };
      },
    }),
  }),
});

export const { useGetUrlToUploadMediaMutation, usePutSingleUrlMediaMutation } =
  mediaApi;
