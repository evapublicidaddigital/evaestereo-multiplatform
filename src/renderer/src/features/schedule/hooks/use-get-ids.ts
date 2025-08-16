import { useCallback } from "react";

export const useGetIds = (): {
  getIds: () => Promise<{
    typeScheduleId: string;
    countryId: string;
    stateId: string;
  }>;
} => {
  const getIds = useCallback(async (): Promise<{
    typeScheduleId: string;
    countryId: string;
    stateId: string;
  }> => {
    try {
      const typeScheduleId = (await window.electron.store.get(
        "typeScheduleId",
      )) as string;
      const countryId = (await window.electron.store.get(
        "countryId",
      )) as string;
      const stateId = (await window.electron.store.get("stateId")) as string;

      return {
        typeScheduleId,
        countryId,
        stateId,
      };
    } catch (error) {
      console.error(error);
      return {
        typeScheduleId: "",
        countryId: "",
        stateId: "",
      };
    }
  }, []);

  return {
    getIds,
  };
};
