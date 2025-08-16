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
import { Man, PlayCircleRounded, Woman } from "@mui/icons-material";
import type { ScheduleModel } from "../../../../data/models";
import { useScreenProvider } from "../../screen-context";

interface RenderItemProps {
  schedule: ScheduleModel;
}

export const RenderItem = ({ schedule }: RenderItemProps): ReactNode => {
  const { activate } = useScreenProvider();

  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        marginTop: 2,
        backgroundColor: "background.paper",
      }}
    >
      <ListItem alignItems="flex-start">
        <ListItemAvatar
          sx={{
            backgroundColor: "#E4E7F0",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            marginRight: 2,
          }}
        >
          <ListItemText
            primary="Cod."
            secondary={schedule.code}
            sx={{ color: "text.secondary", textAlign: "center" }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={schedule.name}
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
                Intervalo: {schedule.interval}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.primary", display: "inline" }}
              >
                Duración: {schedule.duration}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>

      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 2 }}>
        {schedule.media_urls.map((media_url, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid grey",
              borderRadius: 4,
              p: 1,
              m: 1,
            }}
          >
            <IconButton onClick={() => activate(schedule, media_url.type)}>
              <PlayCircleRounded sx={{ color: "primary.main" }} />
            </IconButton>
            <Typography>Voz</Typography>
            {media_url.type === "female" ? (
              <Woman sx={{ color: "primary.main" }} />
            ) : (
              <Man sx={{ color: "primary.main" }} />
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
