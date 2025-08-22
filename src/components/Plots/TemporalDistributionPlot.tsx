import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useData } from "../../context/PublicationDataContext";
import { LineChart, type LineSeries } from "@mui/x-charts";
import { theme } from "../../Theme";
import { useState } from "react";
import { stateColorMapping } from "../../constants/States";

export const TemporalDistributionPlot = () => {
  const { data, serverFilters } = useData();
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
            label: "Selected states",
          },
        ]
      : stateYearlyData.length >= 1
      ? Object.keys(stateYearlyData[0].states).map((state) => ({
          dataKey: state,
          color: stateColorMapping[state] || theme.palette.grey[500],
          showMark: true,
          curve: "linear",
          label: state,
        }))
      : [];

  const dataset =
    view === "national"
      ? yearlyData
      : stateYearlyData.length >= 1
      ? stateYearlyData.map((item) => ({
          year: item.year,
          ...item.states, // Spread state counts as individual keys
        }))
      : [];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h6">
        {view === "national"
          ? "Total Number of Publications Over Time"
          : "Publications Over Time by State"}
      </Typography>
      <Box sx={{ width: "100%" }}>
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
          height={500}
        />
        <Typography variant="caption">
          This line chart displays the trend in total publications under{" "}
          {serverFilters.topic} across selected states from{" "}
          {serverFilters.yearRange[0]} to {serverFilters.yearRange[1]}.
        </Typography>
      </Box>

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
