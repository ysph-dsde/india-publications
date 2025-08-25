import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useData } from "../../context/PublicationDataContext";
// import { LineChart, type LineSeries } from "@mui/x-charts";
import { theme } from "../../Theme";
import { stateColorMapping } from "../../constants/States";
import Plot from "react-plotly.js";

interface TemportalDistributionPlotProps {
  view: "national" | "byState";
  setView: Function;
}

export const TemporalDistributionPlot = ({
  view,
  setView,
}: TemportalDistributionPlotProps) => {
  const {
    data,
    serverFilters,
    clientFilters: { states: selectedStates },
  } = useData();
  const { yearlyData, stateYearlyData } = data;

  // const series: LineSeries[] =
  //   view === "national"
  //     ? [
  //         {
  //           dataKey: "count",
  //           color: `${theme.palette.primary.main}`,
  //           showMark: true, // Show data points
  //           curve: "linear", // Linear interpolation for the line
  //           label: "Selected states",
  //         },
  //       ]
  //     : stateYearlyData.length >= 1
  //     ? Object.keys(stateYearlyData[0].states).map((state) => ({
  //         dataKey: state,
  //         color: stateColorMapping[state] || theme.palette.grey[500],
  //         showMark: true,
  //         curve: "linear",
  //         label: state,
  //       }))
  //     : [];

  // const dataset =
  //   view === "national"
  //     ? yearlyData
  //     : stateYearlyData.length >= 1
  //     ? stateYearlyData.map((item) => ({
  //         year: item.year,
  //         ...item.states, // Spread state counts as individual keys
  //       }))
  //     : [];

  const sortedStates = [...selectedStates].sort((a, b) => a.localeCompare(b));

  const nationalTrace: Plotly.Data[] = [
    {
      x: yearlyData.map((item) => item.year),
      y: yearlyData.map((item) => item.count),
      mode: "lines+markers",
      marker: {
        color: `${theme.palette.primary.main}`,
        size: 10,
      },
      line: {
        color: `${theme.palette.primary.main}`,
        width: 3,
      },
      hovertemplate: `Selected states <br>Year: %{x}<br>Publications: %{y}<extra></extra>`,
    },
  ];

  const statesTrace: Plotly.Data[] = sortedStates.map((state) => ({
    x: stateYearlyData.map((item) => item.year),
    y: stateYearlyData.map((item) => item.states[state] || 0),
    mode: "lines+markers",
    name: state,
    marker: {
      color: stateColorMapping[state] || theme.palette.grey[500],
      size: 10,
    },
    line: {
      color: stateColorMapping[state] || theme.palette.grey[500],
      width: 3,
    },
    hovertemplate: `State: ${state}<br>Year: %{x}<br>Publications: %{y}<extra></extra>`,
  }));

  const traces: Plotly.Data[] =
    view === "national" ? nationalTrace : statesTrace;

  const layout: Partial<Plotly.Layout> = {
    title: {
      text:
        view === "national"
          ? "Total Number of Publications Over Time"
          : "Publications Over Time by State",
    },
    yaxis: {
      showgrid: false,
      title: {
        text: "Number of Publications",
      },
    },
    xaxis: {
      automargin: true,
      showgrid: false,
      title: {
        text: "Year",
      },
      type: "category",
    },
    hovermode: "closest",
    hoverlabel: {
      bgcolor: "white",
    },
    autosize: true,
    dragmode: false,
    legend: { itemclick: false, itemdoubleclick: false },
  };

  const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: false,
    modeBarButtonsToRemove: [
      "pan2d",
      "zoomIn2d",
      "zoomOut2d",
      "lasso2d",
      "select2d",
      "autoScale2d",
      "zoom2d",
      "resetScale2d",
    ],
  };

  return (
    <Paper elevation={1}>
      <Box
        display="flex"
        flexDirection="column"
      >
        <Plot
          data={traces}
          layout={layout}
          config={config}
          style={{
            width: "100%",
            minHeight: 450,
            borderRadius: 4,
          }}
          useResizeHandler
        />
        <Box
          px={2}
          pb={1}
        >
          <Typography variant="caption">
            This line chart displays the trend in total publications under{" "}
            {serverFilters.topic} across selected states from{" "}
            {serverFilters.yearRange[0]} to {serverFilters.yearRange[1]}.
          </Typography>
        </Box>
        <ToggleButtonGroup
          sx={{ alignSelf: "center", pb: 2 }}
          value={view}
          exclusive
          onChange={(_e, newView) => newView && setView(newView)}
        >
          <ToggleButton value="national">National</ToggleButton>
          <ToggleButton value="byState">By State</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
    // <Box
    //   display="flex"
    //   flexDirection="column"
    //   alignItems="center"
    // >
    //   <Typography variant="h6">
    //     {view === "national"
    //       ? "Total Number of Publications Over Time"
    //       : "Publications Over Time by State"}
    //   </Typography>
    //   <Box sx={{ width: "100%" }}>
    //     <LineChart
    //       dataset={dataset}
    //       xAxis={[
    //         {
    //           dataKey: "year",
    //           label: "Year",
    //           valueFormatter: (value: number) => value.toFixed(0),
    //           scaleType: "point",
    //         },
    //       ]}
    //       yAxis={[
    //         {
    //           label: "Number of Publications",
    //         },
    //       ]}
    //       series={series}
    //       height={500}
    //     />
    // <Typography variant="caption">
    //   This line chart displays the trend in total publications under{" "}
    //   {serverFilters.topic} across selected states from{" "}
    //   {serverFilters.yearRange[0]} to {serverFilters.yearRange[1]}.
    // </Typography>
    //   </Box>

    // <ToggleButtonGroup
    //   value={view}
    //   exclusive
    //   onChange={(_e, newView) => newView && setView(newView)}
    // >
    //   <ToggleButton value="national">National</ToggleButton>
    //   <ToggleButton value="byState">By State</ToggleButton>
    // </ToggleButtonGroup>
    // </Box>
  );
};
