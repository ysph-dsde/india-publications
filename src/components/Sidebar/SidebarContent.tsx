import ysphLogo from "../../assets/images/ysphLogoBlues.svg";
import { Loading } from "./Loading";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { Search } from "./Search";
import { Filter } from "./Filter";

export const SidebarContent = () => {
  return (
    <Box>
      <Toolbar>
        <Box
          component="img"
          src={ysphLogo}
          sx={{ maxWidth: "100%", height: "auto" }}
        />
      </Toolbar>
      <Divider />
      <Box sx={{ position: "relative" }}>
        <Loading />
        <Search />
        <Filter />
      </Box>
    </Box>
  );
};
