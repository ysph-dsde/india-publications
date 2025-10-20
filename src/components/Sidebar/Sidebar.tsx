import Drawer from "@mui/material/Drawer";
import { SidebarContent } from "./SidebarContent";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Search } from "./Search";
import { Filter } from "./Filter";

interface SidebarProps {
  drawerWidth: number;
  isClosing: boolean;
  setIsClosing: Function;
  mobileOpen: boolean;
  setMobileOpen: Function;
}

export const Sidebar = ({
  drawerWidth,
  setIsClosing,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) => {
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { sm: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            maxHeight: "100%",
            overflow: "auto",
            borderRadius: 0,
          },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        <SidebarContent />
      </Drawer>
      {/* Desktop */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: drawerWidth,
          gap: 3,
        }}
      >
        <Paper elevation={1}>
          <Search />
        </Paper>
        <Paper>
          <Filter />
        </Paper>
        {/* <SidebarContent /> */}
      </Box>
      {/* <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            position: "sticky",
            top: 0,
            width: drawerWidth,
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer> */}
    </>
  );
};
