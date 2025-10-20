import { Loading } from "./Loading";
import Box from "@mui/material/Box";
import { Search } from "./Search";
import { Filter } from "./Filter";

export const SidebarContent = () => {
  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <Loading />
        <Search />
        <Filter />
      </Box>
    </Box>
  );
};
