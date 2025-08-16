import type { ReactNode } from "react";
import { Box, Button, TextField } from "@mui/material";
import { ScreenProvider, useScreenProvider } from "./screen-context";

export const SignInContent = (): ReactNode => {
  const { license, handleLicenseChange, handleValidate } = useScreenProvider();

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          label="Licencia"
          id="outlined-size-small"
          value={license}
          onChange={handleLicenseChange}
          size="medium"
          placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
          slotProps={{
            input: {
              inputProps: {
                maxLength: 23,
              },
            },
          }}
        />
      </div>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleValidate}
        disabled={license.length !== 23}
      >
        Validar Licencia
      </Button>
    </Box>
  );
};

export const SignInScreen = (): ReactNode => (
  <ScreenProvider>
    <SignInContent />
  </ScreenProvider>
);
