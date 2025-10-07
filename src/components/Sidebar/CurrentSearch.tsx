import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useData } from "../../context/PublicationDataContext";

export const CurrentSearch = () => {
  const { serverFilters } = useData();
  return (
    <Box
      px="1rem"
      py=".75rem"
    >
      <Typography variant="body1" pb={2}>
        Displayed topic: {serverFilters.customKeyword || serverFilters.topic}
      </Typography>
      <Typography variant="body1">
        Displayed year range: {serverFilters.yearRange[0]} -{" "}
        {serverFilters.yearRange[1]}
      </Typography>
    </Box>
  );
};
