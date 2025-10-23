import { LegendChip } from "./LegendChip";
import { getFilteredStates } from "../../../utils/getFilteredStates";
import { useData } from "../../../context/PublicationDataContext";
import Box from "@mui/material/Box";

export const Legend = () => {
  const { clientFilters } = useData();

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      px={2}
      pb={2}
      justifyContent="center"
      rowGap={0.5}
      columnGap={0.5}
    >
      {getFilteredStates(clientFilters).map((state) => (
        <Box>
          <LegendChip state={state} />
        </Box>
      ))}
    </Box>
  );
};
