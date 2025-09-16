import { Drawer } from "@mui/material";
import { SidebarContent } from "./SidebarContent";

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
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            maxHeight: "100%",
            overflow: "auto",
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
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            position: "sticky",
            top: 0,
            width: drawerWidth,
            height: "100vh",
            overflow: "auto",
          },
          mt: 3,
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};
