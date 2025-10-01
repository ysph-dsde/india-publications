import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";

interface TopbarProps {
  handleDrawerToggle: () => void;
}

export const Topbar = ({ handleDrawerToggle }: TopbarProps) => {
  return (
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
  );
};
