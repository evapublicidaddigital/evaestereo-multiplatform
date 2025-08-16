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

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export function ScreenProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const { getIds } = useGetIds();

  const [fetchSchedules, { data: schedules = [] }] = useLazyGetSchedulesQuery();

  const scheduler = useMemo(() => new AudioScheduler(), []);
  const [playing, setPlaying] = useState<PublicJob | null>(null);
  const [queued, setQueued] = useState<PublicJob[]>([]);
  const [text, setText] = useState<string>("");

  const handleSelectAudio = useCallback(
    (audio: ScheduleModel): void => {
      scheduler.activate(audio, "male");
    },
    [scheduler],
  );

  useEffect(() => {
    (async () => {
      const { typeScheduleId, countryId, stateId } = await getIds();
      if (typeScheduleId && countryId && stateId) {
        fetchSchedules({
          type_schedule_id: typeScheduleId,
          country_id: Number(countryId),
          state_id: Number(stateId),
        });
      }
    })();
  }, [fetchSchedules, getIds]);

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
        activate: (s, v) => scheduler.activate(s, v),
        turnOff: (id) => scheduler.turnOff(id),
        handleSelectAudio,
        text,
        setText,
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
