import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useData } from "../../context/PublicationDataContext";

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
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontSize: "1.5rem" }}
        >
          {serverFilters.customKeyword || serverFilters.topic} |{" "}
          {serverFilters.yearRange[0]} - {serverFilters.yearRange[1]}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
