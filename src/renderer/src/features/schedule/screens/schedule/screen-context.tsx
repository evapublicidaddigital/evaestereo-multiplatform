import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ScreenContextType } from "./screen-types";
import { useLazyGetSchedulesQuery } from "../../data/services/remote/schedule-api";
import type { ScheduleModel } from "../../data/models";
import { useGetIds } from "../../hooks";
import type { PublicJob } from "../../services/types";
import { AudioScheduler } from "../../services/audio-scheduler";
import { useAuthContext } from "@renderer/core/context/auth-context/auth-context";

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export function ScreenProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const { license } = useAuthContext();
  const { getIds } = useGetIds();

  const [fetchSchedules, { data: schedules = [], isFetching }] =
    useLazyGetSchedulesQuery();

  const scheduler = useMemo(() => new AudioScheduler(), []);
  const [playing, setPlaying] = useState<PublicJob | null>(null);
  const [queued, setQueued] = useState<PublicJob[]>([]);
  const [text, setText] = useState<string>("");
  const [value, setValue] = useState(0);
  const [bottomValue, setBottomValue] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSelectAudio = useCallback(
    (audio: ScheduleModel): void => {
      scheduler.activate(audio, "male");
    },
    [scheduler],
  );

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ): void => {
    setValue(newValue);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleFetchSchedules = useCallback(async () => {
    const { typeScheduleId, countryId, stateId } = await getIds();

    console.log("🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈", typeScheduleId);
    console.log("🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈", countryId);
    console.log("🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈", stateId);

    if (typeScheduleId && countryId && stateId) {
      fetchSchedules({
        type_schedule_id: typeScheduleId,
        country_id: Number(countryId),
        state_id: Number(stateId),
        client_id: "73878",
      });
    }
  }, [fetchSchedules, getIds]);

  const handleSync = useCallback(async () => {
    handleFetchSchedules();
    setOpen(false);
  }, [handleFetchSchedules]);

  useEffect(() => {
    handleFetchSchedules();
  }, [handleFetchSchedules]);

  useEffect(() => {
    const unsub = scheduler.subscribe(({ playing, queued }) => {
      setPlaying(playing);
      setQueued(queued);
    });
    return () => {
      unsub();
      scheduler.dispose();
    };
  }, [scheduler]);

  return (
    <ScreenContext.Provider
      value={{
        schedules,
        playing,
        queued,
        text,
        open,
        value,
        bottomValue,
        isFetching,
        activate: (s, v) => scheduler.activate(s, v),
        turnOff: (id) => scheduler.turnOff(id),
        handleSelectAudio,
        setText,
        setValue,
        setBottomValue,
        setOpen,
        handleChange,
        handleClose,
        handleSync,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
}
export function useScreenProvider(): ScreenContextType {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useScreenProvider must be used within a ScreenProvider");
  }
  return context;
}
