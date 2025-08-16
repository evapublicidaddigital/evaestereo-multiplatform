import type { ReactNode } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useAuthContext } from "@renderer/core/context/auth-context/auth-context";

export const Profile = (): ReactNode => {
  const { license } = useAuthContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Perfil
      </Typography>
      <Paper
        elevation={3}
        sx={{ padding: 2, marginTop: 2, width: "100%", maxWidth: 400 }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Nombre
          </Typography>
          <Typography variant="h6">{license?.Customer.Name}</Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Key
          </Typography>
          <Typography variant="h6">{license?.Key}</Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Expira
          </Typography>
          <Typography variant="h6">
            {new Date((license?.Expires ?? 0) * 1000).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Periodo
          </Typography>
          <Typography variant="h6">{license?.Period} días</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
