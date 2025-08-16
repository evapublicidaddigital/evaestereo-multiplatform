import React, { useState, type ReactNode } from "react";
import { ScreenProvider, useScreenProvider } from "./screen-context";
import {
  Box,
  Tabs,
  Tab,
  AppBar,
  useTheme,
  Typography,
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
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { a11yPropsTabPanel } from "../../utils";
import { ListDefault, ListOwn, TabPanel } from "./fragments";
import CssBaseline from "@mui/material/CssBaseline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import SearchIcon from "@mui/icons-material/Search";
import { SyncRounded, KeyboardAltRounded } from "@mui/icons-material";

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
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
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
  const [value, setValue] = useState(0);
  const [bottomValue, setBottomValue] = useState(0);
  const { text, setText } = useScreenProvider();

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ): void => {
    setValue(newValue);
  };

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
                />
              </Search>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  // aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  // onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <SyncRounded />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  // aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  // onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <KeyboardAltRounded />
                </IconButton>
              </Box>
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
              <Tab label="Propias" {...a11yPropsTabPanel(1)} />
              <Tab label="Activas" {...a11yPropsTabPanel(2)} />
            </Tabs>
          </AppBar>
          <Toolbar id="back-to-top-anchor" />
          <Container>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <ListDefault />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Typography>Propias</Typography>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
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

      {bottomValue === 1 && <Typography>Perfil</Typography>}

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
    </React.Fragment>
  );
};

export const ScheduleScreen = (): ReactNode => (
  <ScreenProvider>
    <ScheduleContent />
  </ScreenProvider>
);
