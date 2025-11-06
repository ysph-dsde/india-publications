import { LegendChip } from "./LegendChip";
import { getFilteredStates } from "../../../utils/getFilteredStates";
import { useData } from "../../../context/PublicationDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export const Legend = () => {
  const { clientFilters } = useData();
  return (
    <Grid
      sx={{ display: { xs: "none", sm: "flex" } }}
      container
      alignItems="stretch"
      px={2}
      pb={2}
      justifyContent="center"
      rowGap={0.5}
      columnGap={0.5}
    >
      {getFilteredStates(clientFilters).map((state, index) => (
        <Grid key={index}>
          <Box sx={{ minWidth: 150, width: 200 }}>
            <LegendChip state={state} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
