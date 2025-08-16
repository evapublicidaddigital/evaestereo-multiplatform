import React, { type ReactNode } from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { GraphicEq, PowerSettingsNew } from "@mui/icons-material";
import { useScreenProvider } from "../../screen-context";

interface RenderItemProps {
  scheduleId: string;
  code: string;
  name: string;
  interval: string;
  duration: string;
  remainingPlays: number;
  nextRunAt: number;
}

export const RenderItemActive = ({
  scheduleId,
  code,
  name,
  interval,
  duration,
  remainingPlays,
  nextRunAt,
}: RenderItemProps): ReactNode => {
  const { turnOff, playing } = useScreenProvider();

  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        marginTop: 2,
        backgroundColor: "#66bb6a",
      }}
    >
      <ListItem alignItems="flex-start">
        <ListItemAvatar
          sx={{
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            marginRight: 2,
          }}
        >
          <ListItemText
            primary="Cod."
            secondary={code}
            sx={{ color: "text.primary", textAlign: "center" }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: "text.primary",
                  display: "inline",
                  borderWidth: 1,
                  borderColor: "text.secondary",
                  borderRadius: 1,
                  padding: 0.5,
                  marginRight: 1,
                }}
              >
                Intervalo: {interval}
                Duración: {duration}
                <br /> Restantes: {remainingPlays}
                <br /> Siguiente ejecución:{" "}
                {new Date(nextRunAt).toLocaleTimeString()}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: 1,
          paddingRight: 1,
        }}
      >
        <IconButton
          onClick={() => turnOff(scheduleId)}
          disabled={playing?.scheduleId === scheduleId}
          sx={{ backgroundColor: "red" }}
        >
          {playing?.scheduleId === scheduleId ? (
            <GraphicEq sx={{ color: "white" }} />
          ) : (
            <PowerSettingsNew sx={{ color: "white" }} />
          )}
        </IconButton>
      </Box>
    </Paper>
  );
};
