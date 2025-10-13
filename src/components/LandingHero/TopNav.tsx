import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ysphLogo from "../../assets/images/ysphLogoWhite.svg";
import MenuIcon from "@mui/icons-material/Menu";
import type { ExploreOption } from "./LandingHero";

interface TopNavProps {
  exploreOptions: ExploreOption[];
}

export const TopNav = ({ exploreOptions }: TopNavProps) => {
  const navItems = ["Home", "About", "FAQ"];
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center" }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item}
            disablePadding
          >
            <ListItemButton sx={{ textAlign: "left" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <Divider />
        {exploreOptions.map((item, id) => (
          <ListItem
            key={id}
            disablePadding
          >
            <ListItemButton sx={{ textAlign: "left" }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        position="static"
        sx={{
          background: "linear-gradient(to right, #000C8D, #790DA7)",
          height: 100,
          px: { xs: "3%", xl: "15%" },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Indiapub.org
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: "white" }}
            />
            <Box
              component="img"
              src={ysphLogo}
              alt="YSPH DSDE logo"
              width="50%"
            />
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: "none", md: "block" }, height: "100%" }}>
            {navItems.map((item) => (
              <Button
                size="large"
                key={item}
                sx={{ color: "#fff", px: 3, height: "100%" }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
            },
          }}
          anchor="bottom"
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};
