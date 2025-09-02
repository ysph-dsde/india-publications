import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useData } from "../../context/PublicationDataContext";
// import { LineChart, type LineSeries } from "@mui/x-charts";
import { theme } from "../../Theme";
import { stateColorMapping } from "../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { useMemo } from "react";

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
    serverFilters: { yearRange, topic, customKeyword },
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

  const nationalTrace: Plotly.Data[] = useMemo(() => {
    return [
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
  }, [yearlyData]);

  const statesTrace: Plotly.Data[] = useMemo(() => {
    return sortedStates.map((state) => ({
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
  }, [stateYearlyData, sortedStates]);

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
      title: {
        text: "Number of Publications",
      },
    },
    xaxis: {
      title: {
        text: "Year",
      },
      type: "category",
    },
  };

  return (
    <PlotWrapper>
      <CustomPlot
        data={traces}
        layout={layout}
      />
      <PlotCaption>
        This line chart displays the trend in total publications under{" "}
        {customKeyword || topic} across selected states from {yearRange[0]} to{" "}
        {yearRange[1]}.
      </PlotCaption>
      <ToggleButtonGroup
        sx={{ alignSelf: "center", pb: 2 }}
        value={view}
        exclusive
        onChange={(_e, newView) => newView && setView(newView)}
      >
        <ToggleButton value="national">National</ToggleButton>
        <ToggleButton value="byState">By State</ToggleButton>
      </ToggleButtonGroup>
    </PlotWrapper>
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
