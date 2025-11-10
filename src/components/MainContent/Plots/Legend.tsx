import { LegendChip } from "./LegendChip";
import { useData } from "../../../context/PublicationDataContext";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "../../../Theme";
import Box from "@mui/material/Box";

export const Legend = () => {
  const { clientFilters } = useData();

  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  const numCols = isXl ? 4 : isLg ? 3 : 2;

  const perColumn = Math.ceil(clientFilters.states.length / numCols);
  const columns = Array.from({ length: numCols }, (_, i) =>
    clientFilters.states.slice(i * perColumn, (i + 1) * perColumn),
  ).filter((col) => col.length > 0);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: { xs: "none", sm: "flex" },
      }}
      px={2}
      pb={2}
      justifyContent="center"
      columnGap={5}
      columns={numCols}
    >
      {columns.map((col, index) => (
        <Grid key={index}>
          {col.map((state) => (
            <Box sx={{ py: 0.25 }}>
              <LegendChip state={state} />
            </Box>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};
