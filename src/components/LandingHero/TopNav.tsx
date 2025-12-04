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
import { useData } from "../../context/PublicationDataContext";
import type { PublicationTopic } from "../../constants/FilterTypes";

interface TopNavProps {
  exploreOptions: ExploreOption[];
}

export const TopNav = ({ exploreOptions }: TopNavProps) => {
  const { updateServerFilters } = useData();

  // navItems can be used in future implementation, left empty for now. 
  // Could consider ["Home", "About", "FAQ"];
  const navItems: string[] = [];
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (selectedTopic: PublicationTopic) => {
    updateServerFilters({
      topic: selectedTopic,
    });
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center" }}
    >
      <List sx={{ textAlign: "left" }}>
        <ListItem>
          <Typography fontWeight="bold">Search by topic</Typography>
        </ListItem>
        <Divider />
        {navItems.map((item) => (
          <ListItem
            key={item}
            disablePadding
          >
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        {navItems.length > 0 && <Divider />}
        {exploreOptions.map((item, id) => (
          <ListItem
            key={id}
            disablePadding
          >
            <ListItemButton
              sx={{ textAlign: "left" }}
              onClick={() => handleOptionSelect(item.label)}
            >
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
        elevation={0}
        sx={{
          bgcolor: "inherit",
          height: 100,
          px: { xs: "3%" },
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
              gap: { xs: 1, sm: 2 },
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
            sx={{ mr: 2, display: { md: "none" }, m: 0 }}
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
          slotProps={{
            paper: {
              sx: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};
