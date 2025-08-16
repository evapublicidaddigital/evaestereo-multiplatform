import { List } from "@mui/material";
import { useScreenProvider } from "../../screen-context";
import { type ReactNode } from "react";
import { RenderItemActive } from "../render-item-active/render-item-active";

export const ListOwn = (): ReactNode => {
  const { queued, playing } = useScreenProvider();

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
      {playing && (
        <RenderItemActive
          scheduleId={playing.scheduleId}
          code={playing.code}
          name={playing.name}
          interval={playing.interval}
          duration={playing.duration}
          remainingPlays={playing.remainingPlays}
          nextRunAt={playing.nextRunAt || 0}
        />
      )}

      {queued.map((q) => (
        <RenderItemActive
          key={q.jobId}
          scheduleId={q.scheduleId}
          code={q.code}
          name={q.name}
          interval={q.interval}
          duration={q.duration}
          remainingPlays={q.remainingPlays}
          nextRunAt={q.nextRunAt || 0}
        />
      ))}
      {/* <div style={{ display: "grid", gap: 8 }}>
        {queued.map((q) => (
          <div
            key={q.jobId}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 10,
            }}
          >
            <div style={{ fontWeight: 600 }}>{q.scheduleName}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Voz: {q.voiceType} • Siguiente ejecución:{" "}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {new Date(q.nextRunAt!).toLocaleTimeString()}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              • Restantes:{" "}
              {Number.isFinite(q.remainingPlays) ? q.remainingPlays : "∞"}
            </div>
            <button
              onClick={() => turnOff(q.scheduleId)}
              style={{
                marginTop: 6,
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #f66",
                color: "#b00",
              }}
            >
              Apagar
            </button>
          </div>
        ))}
      </div> */}
    </List>
  );
};
