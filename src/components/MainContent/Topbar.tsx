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
            display: "flex",
            flexWrap: "wrap",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 0.5, md: 1 },
            py: { xs: 1.5, md: 0 },
            "& > *": {
              fontSize: "1.5rem",
              lineHeight: 1,
            },
          }}
        >
          <Typography variant="h6">
            {serverFilters.customKeyword || serverFilters.topic}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "white" }}
          />
          <Typography variant="h6">
            {serverFilters.yearRange[0]} - {serverFilters.yearRange[1]}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
