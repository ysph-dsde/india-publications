import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useData } from "../../context/DataContext";
import { LineChart, type LineSeries } from "@mui/x-charts";
import { theme } from "../../Theme";
import { useState } from "react";

export const TemporalDistributionPlot = () => {
  const { data } = useData();
  const { yearlyData, stateYearlyData } = data;
  const [view, setView] = useState<"national" | "byState">("national");

  const series: LineSeries[] =
    view === "national"
      ? [
          {
            dataKey: "count",
            color: `${theme.palette.primary.main}`,
            showMark: true, // Show data points
            curve: "linear", // Linear interpolation for the line
          },
        ]
      : Object.keys(stateYearlyData[0].states).map((state) => ({
          dataKey: state,
          //   color: theme.palette[state] || getColorForState(state),
          showMark: true,
          curve: "linear",
          label: state,
        }));

  const dataset =
    view === "national"
      ? yearlyData
      : stateYearlyData.map((item) => ({
          year: item.year,
          ...item.states, // Spread state counts as individual keys
        }));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h6">
        Total Number of Publications Over Time
      </Typography>
      <LineChart
        dataset={dataset}
        xAxis={[
          {
            dataKey: "year",
            label: "Year",
            valueFormatter: (value: number) => value.toFixed(0),
            scaleType: "point",
          },
        ]}
        yAxis={[
          {
            label: "Number of Publications",
          },
        ]}
        series={series}
        height={400}
        sx={{ width: "100%" }}
      />
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_e, newView) => newView && setView(newView)}
      >
        <ToggleButton value="national">National</ToggleButton>
        <ToggleButton value="byState">By State</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
