import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CountryDto, StateDto, CityDto } from "../dto";

export const countryApi = createApi({
  reducerPath: "countryAPI",
  refetchOnReconnect: true,
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_COUNTRY_API_URL,
    timeout: 30 * 1000,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set(
        "X-CSCAPI-KEY",
        `RVJKVnJLMTU5ZkRPTzJjMmdHNzBEd0lOSm01cVhjMmYzS0sxZWlXOQ==`
      );
      return headers;
    },
  }),
  endpoints: (build) => ({
    getAllCountry: build.query<CountryDto[], void>({
      query: () => "countries",
      transformResponse: (response: CountryDto[]) => {
        const whiteListCountries = [
          "Colombia",
          "Panama",
          "Chile",
          "Peru",
          "Ecuador",
          "Argentina",
          "Uruguay",
          "Paraguay",
          "Bolivia",
          "Venezuela",
          "Costa Rica",
        ];
        const filteredCountries = response.filter((country) =>
          whiteListCountries.some((whiteListCountry) =>
            country.name.toLowerCase().includes(whiteListCountry.toLowerCase())
          )
        );

        // Sort countries to put Colombia first
        return filteredCountries.sort((a, b) => {
          if (a.name.toLowerCase() === "colombia") return -1;
          if (b.name.toLowerCase() === "colombia") return 1;
          return 0;
        });
      },
    }),
    getAllStateByCountry: build.query<StateDto[], string>({
      query: (countryIso) => `countries/${countryIso}/states`,
      transformResponse: (response: StateDto[]) => {
        // Sort countries to put Colombia first
        return response.sort((a, b) => {
          if (a.name.toLowerCase() === "valle del cauca") return -1;
          if (b.name.toLowerCase() === "valle del cauca") return 1;
          return 0;
        });
      },
    }),
    getAllCityByState: build.query<
      CityDto[],
      { countryIso: string; stateIso: string }
    >({
      query: ({ countryIso, stateIso }) =>
        `countries/${countryIso}/states/${stateIso}/cities`,
      transformResponse: (response: CityDto[]) => {
        return response.sort((a, b) => {
          if (a.name.toLowerCase() === "cali") return -1;
          if (b.name.toLowerCase() === "cali") return 1;
          return 0;
        });
      },
    }),
  }),
});

export const {
  useGetAllCountryQuery,
  useLazyGetAllStateByCountryQuery,
  useLazyGetAllCityByStateQuery,
} = countryApi;
