import { theme } from "./Theme";
import { useState } from "react";
import { MainContent } from "./components/MainContent/MainContent";
import { DataProvider } from "./context/PublicationDataContext";
import { PopulationProvider } from "./context/PopulationContext";
import { LandingHero } from "./components/LandingHero/LandingHero";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { Topbar } from "./components/MainContent/Topbar";

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
          <Box
            sx={{
              bgcolor: theme.palette.gray.lightest,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <LandingHero />
            <Box
              sx={{
                display: "flex",
                bgcolor: theme.palette.gray.lightest,
                px: "3%",
                gap: 3,
              }}
            >
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
                  minHeight: "100vh",
                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Topbar handleDrawerToggle={handleDrawerToggle} />
                <MainContent />
              </Box>
            </Box>
          </Box>
        </PopulationProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
