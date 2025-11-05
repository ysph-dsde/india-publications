import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useData } from "../../context/PublicationDataContext";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

interface TopbarProps {
  handleDrawerToggle: () => void;
}

export const Topbar = ({ handleDrawerToggle }: TopbarProps) => {
  const { serverFilters } = useData();

  return (
    <AppBar
      color="secondary"
      sx={{
        position: "sticky",
        top: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            my: 1.5,
            display: "flex",
            flexWrap: "wrap",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 0.5, md: 1 },
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            fontSize="1.5rem"
            sx={{ lineHeight: 1 }}
          >
            {serverFilters.customKeyword || serverFilters.topic}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "white" }}
          />
          <Typography
            variant="h6"
            fontSize="1.5rem"
            sx={{ lineHeight: 1 }}
          >
            {serverFilters.yearRange[0]} - {serverFilters.yearRange[1]}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
