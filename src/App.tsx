import "./App.css";
import MenuIcon from "@mui/icons-material/Menu";
import { theme } from "./Theme";
import { useState } from "react";
import { MainContent } from "./components/MainContent/MainContent";
import { DataProvider } from "./context/PublicationDataContext";
import { PopulationProvider } from "./context/PopulationContext";
import { LandingHero } from "./components/LandingHero";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

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
                    sx={{ fontSize: "1.5rem" }}
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
