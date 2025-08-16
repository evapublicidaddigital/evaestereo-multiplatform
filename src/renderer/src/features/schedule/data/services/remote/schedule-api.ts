import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";
import type {
  ScheduleDto,
  ScheduleDtoPost,
  TypeScheduleDto,
  TypeScheduleDtoPost,
} from "../../dto/schedule-dto";
import type {
  ScheduleModel,
  TypeScheduleModel,
  TypeScheduleResponseModel,
  TypeScheduleParamsModel,
  ScheduleParamsModel,
} from "../../models";
import { scheduleMapper, typeScheduleMapper } from "../../mappers";
import type { GeneralResponseDto } from "../../dto/general-response-dto";

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  refetchOnReconnect: true,
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    timeout: 30 * 1000,
    credentials: "include",
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error(
          "Error al obtener el token de Cognito o sesión no activa:",
          error,
        );
      }
      return headers;
    },
  }),
  tagTypes: ["Schedule", "TypeSchedule"],
  endpoints: (builder) => ({
    getSchedules: builder.query<ScheduleModel[], ScheduleParamsModel>({
      query: ({
        name,
        limit,
        nextToken,
        type_schedule_id,
        country_id,
        state_id,
        client_id,
      }) => {
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (limit) params.append("limit", limit.toString());
        if (nextToken) params.append("nextToken", JSON.stringify(nextToken));
        if (client_id) params.append("client_id", client_id?.toString());
        return `get-all-schedules/${type_schedule_id}/${country_id}/${state_id}?${params.toString()}`;
      },
      transformResponse: (response: GeneralResponseDto<ScheduleDto>) => {
        return scheduleMapper(response.items || []);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Schedule" as const,
                id,
              })),
              { type: "Schedule", id: "LIST" },
            ]
          : [{ type: "Schedule", id: "LIST" }],
    }),

    addSchedule: builder.mutation<ScheduleModel[], Partial<ScheduleDtoPost>>({
      query: (body) => ({
        url: "create-schedule",
        method: "POST",
        body,
      }),
    }),
    updateSchedule: builder.mutation<ScheduleModel[], Partial<ScheduleDtoPost>>(
      {
        query: (body) => ({
          url: `update-schedule/${body.type_schedule_id}/${body.id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: [{ type: "Schedule", id: "LIST" }],
      },
    ),

    deleteSchedule: builder.mutation<ScheduleModel[], Partial<ScheduleDtoPost>>(
      {
        query: (body) => ({
          url: `delete-schedule/${body.type_schedule_id}/${body.id}`,
          method: "DELETE",
        }),
      },
    ),

    getTypeSchedules: builder.query<
      TypeScheduleResponseModel,
      TypeScheduleParamsModel
    >({
      query: ({ name, limit, nextToken }) => {
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (limit) params.append("limit", limit.toString());
        if (nextToken) params.append("nextToken", JSON.stringify(nextToken));

        return `get-all-type-schedules?${params.toString()}`;
      },
      transformResponse: (response: GeneralResponseDto<TypeScheduleDto>) => {
        return {
          typeSchedules: typeScheduleMapper(response.items || []),
          nextToken: response.next_token,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.typeSchedules.map(({ id }) => ({
                type: "TypeSchedule" as const,
                id,
              })),
              { type: "TypeSchedule", id: "LIST" },
            ]
          : [{ type: "TypeSchedule", id: "LIST" }],
    }),

    getTypeSchedulesSimple: builder.query<TypeScheduleModel[], void>({
      query: () => "get-all-type-schedules",
      transformResponse: (response: GeneralResponseDto<TypeScheduleDto>) => {
        const mappedItems = typeScheduleMapper(response.items || []);
        return mappedItems.sort((a, b) => {
          if (a.name === "PANADERIA") return -1;
          if (b.name === "PANADERIA") return 1;
          return a.name.localeCompare(b.name);
        });
      },
    }),

    addTypeSchedule: builder.mutation<
      TypeScheduleModel[],
      Partial<TypeScheduleDtoPost>
    >({
      query: (body) => ({
        url: "create-type-schedule",
        method: "POST",
        body,
      }),
    }),
    updateTypeSchedule: builder.mutation<
      TypeScheduleModel[],
      Partial<TypeScheduleDtoPost>
    >({
      query: (body) => ({
        url: `update-type-schedule/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "TypeSchedule", id: "LIST" }],
    }),

    deleteTypeSchedule: builder.mutation<
      TypeScheduleModel[],
      Partial<TypeScheduleDtoPost>
    >({
      query: (body) => ({
        url: `delete-type-schedule/${body.id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  // Schedule
  useGetSchedulesQuery,
  useLazyGetSchedulesQuery,
  useAddScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,

  // Type Schedule
  useGetTypeSchedulesSimpleQuery,
  useLazyGetTypeSchedulesQuery,
  useAddTypeScheduleMutation,
  useUpdateTypeScheduleMutation,
  useDeleteTypeScheduleMutation,
} = scheduleApi;
