import { List } from "@mui/material";
import { useScreenProvider } from "../../screen-context";
import { useMemo, type ReactNode } from "react";
import { RenderItem } from "../render-item/render-item";

export const ListDefault = (): ReactNode => {
  const { schedules, playing, queued, text } = useScreenProvider();

  // const isActive = (scheduleId: string): boolean =>
  //   playing?.scheduleId === scheduleId ||
  //   queued.some((q) => q.scheduleId === scheduleId);

  // IDs to exclude from the main list
  const excludedIds = useMemo(() => {
    const ids = new Set<string>();
    if (playing) ids.add(playing.scheduleId);
    for (const q of queued) ids.add(q.scheduleId);
    return ids;
  }, [playing, queued]);

  // Only show schedules that are NOT playing/queued
  const visibleSchedules = useMemo(
    () => schedules.filter((s) => !excludedIds.has(s.id)),
    [schedules, excludedIds],
  );

  const filteredSchedules = useMemo(() => {
    return visibleSchedules.filter((s) =>
      s.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "")
        .includes(text.toLowerCase().trim().replace(/\s+/g, "")),
    );
  }, [visibleSchedules, text]);

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 512,
        bgcolor: "background.paper",
        paddingBottom: 10,
        paddingTop: 8,
      }}
    >
      {filteredSchedules.map((schedule) => (
        <RenderItem key={schedule.id} schedule={schedule} />
      ))}
    </List>
  );
};
