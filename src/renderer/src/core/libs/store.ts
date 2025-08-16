import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { scheduleApi } from "../../features/schedule/data/services/remote/schedule-api";
import { countryApi } from "../data/services/country-api";
import { mediaApi } from "../data/services/media-api";

export const store = configureStore({
  reducer: {
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      scheduleApi.middleware,
      countryApi.middleware,
      mediaApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
