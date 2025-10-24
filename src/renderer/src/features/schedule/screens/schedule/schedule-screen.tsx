import React, { type ReactNode, useCallback, useMemo, useState } from "react";
import { ScreenProvider, useScreenProvider } from "./screen-context";
import {
  Box,
  Tabs,
  Tab,
  AppBar,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useScrollTrigger,
  Toolbar,
  Fade,
  Fab,
  Container,
  alpha,
  styled,
  InputBase,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  SwipeableDrawer,
  Divider,
  Typography,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { a11yPropsTabPanel } from "../../utils";
import { ListDefault, ListOwn, Profile, TabPanel } from "./fragments";
import CssBaseline from "@mui/material/CssBaseline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import SearchIcon from "@mui/icons-material/Search";
import { Keyboard, SyncRounded, Backspace } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

function ScrollTop(props: Props): ReactNode {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 64, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export const ScheduleContent = (props: Props): ReactNode => {
  const theme = useTheme();
  const {
    text,
    queued,
    playing,
    value,
    bottomValue,
    open,
    // isFetching,
    setText,
    setBottomValue,
    setOpen,
    handleChange,
    handleClose,
    handleSync,
    schedules,
    activate,
  } = useScreenProvider();

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const handleActivateByCode = useCallback(
    (code: string) => {
      const normalized = code.trim();
      if (!normalized) return;

      const schedule = schedules.find(
        (s) => String(s.code).trim() === normalized,
      );

      if (!schedule) {
        window.alert("El código no existe.");
        return;
      }

      const isActive =
        (playing && playing.scheduleId === schedule.id) ||
        queued.some((q) => q.scheduleId === schedule.id);

      if (isActive) {
        window.alert("El código ya está sonando o en cola.");
        return;
      }

      const voiceType = schedule.media_urls[0]?.type ?? "male";
      activate(schedule, voiceType);
      setKeyboardOpen(false);
    },
    [activate, playing, queued, schedules],
  );

  // if (isFetching) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <React.Fragment>
      <CssBaseline />
      {bottomValue === 0 && (
        <React.Fragment>
          <AppBar>
            <Toolbar>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Buscar…"
                  inputProps={{ "aria-label": "search" }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    width: "80%",
                  }}
                  endAdornment={
                    text && (
                      <IconButton
                        onClick={() => setText("")}
                        edge="end"
                        color="inherit"
                      >
                        <ClearIcon />
                      </IconButton>
                    )
                  }
                />
              </Search>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  onClick={() => setOpen(true)}
                  size="large"
                  aria-label="show more"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SyncRounded />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  onClick={() => setKeyboardOpen(true)}
                  size="large"
                  aria-label="show more"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <Keyboard />
                </IconButton>
              </Box>
              {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <KeyboardAltRounded />
                </IconButton>
              </Box> */}
            </Toolbar>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
              role="navigation"
              centered
            >
              <Tab label="Por defecto" {...a11yPropsTabPanel(0)} />
              <Tab
                label={`Activas (${queued.length + (playing ? 1 : 0)})`}
                {...a11yPropsTabPanel(1)}
              />
            </Tabs>
          </AppBar>
          <Toolbar id="back-to-top-anchor" />
          <Container>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <ListDefault />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <ListOwn />
            </TabPanel>
            <ScrollTop {...props}>
              <Fab size="small" aria-label="scroll back to top" color="primary">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </Container>
        </React.Fragment>
      )}

      {bottomValue === 1 && <Profile />}

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={bottomValue}
          onChange={(_event, newValue) => {
            setBottomValue(newValue);
          }}
          sx={{
            justifyContent: "space-around",
          }}
        >
          <BottomNavigationAction
            label="Programaciones"
            icon={<AccessTimeFilledIcon />}
          />
          <BottomNavigationAction
            label="Perfil"
            icon={<ManageAccountsIcon />}
          />
        </BottomNavigation>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Sincronizar programaciones
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Desea sincronizar las programaciones?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button onClick={handleSync} autoFocus color="primary">
            Sincronizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom sheet numeric keypad */}
      {keyboardOpen && (
        <NumericKeypadDrawer
          open={keyboardOpen}
          onClose={() => setKeyboardOpen(false)}
          onActivate={(code) => handleActivateByCode(code)}
        />
      )}
    </React.Fragment>
  );
};

export const ScheduleScreen = (): ReactNode => (
  <ScreenProvider>
    <ScheduleContent />
  </ScreenProvider>
);

// Internal keypad drawer component
const NumericKeypadDrawer = ({
  open,
  onClose,
  onActivate,
}: {
  open: boolean;
  onClose: () => void;
  onActivate: (code: string) => void;
}): ReactNode => {
  const [input, setInput] = useState<string>("");

  const handleDigit = useCallback((d: number) => {
    setInput((prev) => `${prev}${d}`);
  }, []);

  const handleBackspace = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const canActivate = useMemo(() => input.trim().length > 0, [input]);

  const handleActivate = useCallback(() => {
    if (!canActivate) return;
    onActivate(input.trim());
  }, [canActivate, input, onActivate]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      PaperProps={{ sx: { borderTopLeftRadius: 12, borderTopRightRadius: 12 } }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Typography variant="h6">Ingresar código</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "action.hover",
            borderRadius: 1,
            px: 2,
            py: 1.5,
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ letterSpacing: 2 }}>
            {input || "—"}
          </Typography>
          <Box>
            <IconButton onClick={handleBackspace} aria-label="borrar">
              <Backspace />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <Button
              key={n}
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleDigit(n)}
            >
              {n}
            </Button>
          ))}
          <Button variant="outlined" fullWidth onClick={handleClear}>
            Limpiar
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleDigit(0)}
          >
            0
          </Button>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleActivate}
            disabled={!canActivate}
          >
            Activar
          </Button>
        </Box>

        <Divider sx={{ mt: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
          <Button onClick={onClose}>Cerrar</Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};
