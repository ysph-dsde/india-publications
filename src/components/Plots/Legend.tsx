import { Box, Grid } from "@mui/material";
import { States } from "../../constants/States";
import { LegendChip } from "./LegendChip";

export const Legend = () => {
  const maxWidth = Math.max(...States.map((state) => state.length)) * 11;

  return (
    <Grid
      container
      alignItems="stretch"
      px={2}
      pb={2}
      justifyContent="center"
      rowGap={1}
    >
      {[...States]
        .sort((a, b) => a.localeCompare(b))
        .map((state, index) => (
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
