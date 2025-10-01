import { States } from "../../../constants/States";
import { LegendChip } from "./LegendChip";
import { getFilteredStates } from "../../../utils/getFilteredStates";
import { useData } from "../../../context/PublicationDataContext";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const Legend = () => {
  const { clientFilters } = useData();
  const maxWidth = Math.max(...States.map((state) => state.length)) * 11;

  return (
    <Grid
      container
      alignItems="stretch"
      px={2}
      pb={2}
      justifyContent="center"
      rowGap={1}
      sx={{
        maxHeight: "14rem",
        overflowY: "auto",
      }}
    >
      {getFilteredStates(clientFilters).map((state, index) => (
        <Grid key={index}>
          <Box
            sx={{
              width: maxWidth,
            }}
          >
            <LegendChip state={state} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
