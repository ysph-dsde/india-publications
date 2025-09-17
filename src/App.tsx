import "./App.css";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { theme } from "./Theme";
import { useState } from "react";
import { MainContent } from "./components/MainContent";
import { DataProvider } from "./context/PublicationDataContext";
import { PopulationProvider } from "./context/PopulationContext";
import { LandingHero } from "./components/LandingHero";
import { Sidebar } from "./components/Sidebar/Sidebar";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const drawerWidth = 260;

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <PopulationProvider>
          <CssBaseline />
          <LandingHero />
          <Box sx={{ display: "flex" }}>
            <Sidebar
              drawerWidth={drawerWidth}
              isClosing={isClosing}
              setIsClosing={setIsClosing}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                minHeight: "100vh",
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AppBar
                sx={{
                  position: "sticky",
                  top: 0,
                }}
              >
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: "none" } }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                  >
                    Characterizing the Distribution of Publications in India
                  </Typography>
                </Toolbar>
              </AppBar>
              <MainContent />
            </Box>
          </Box>
        </PopulationProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
