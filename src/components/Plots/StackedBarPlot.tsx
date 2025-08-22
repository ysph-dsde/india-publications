import { Box, Paper, Typography } from "@mui/material";
import Plot from "react-plotly.js";
import { useData } from "../../context/PopulationDataContext";
import { stateColorMapping } from "../../constants/States";

export const StackedBarPlot = () => {
  const {
    data: { publications: publicationData, stateYearlyData },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic },
  } = useData();
  const totalPublications = publicationData.length;

  // extract years from data
  const years = stateYearlyData.map((item) => item.year);

  // calculate yearly totals
  const yearlyTotals = stateYearlyData.map((item) => {
    return selectedStates.reduce((sum, state) => {
      return sum + (item.states[state] || 0);
    }, 0);
  });

  // sort states alphabetically
  const sortedStates = [...selectedStates].sort((a, b) => b.localeCompare(a));

  // build traces (one per state)
  const traces: Plotly.Data[] = sortedStates.map((state) => {
    // calculate percentages for the state
    const percentages = stateYearlyData.map((item, index) => {
      const rawValue = item.states[state] || 0;
      const total = yearlyTotals[index];
      return total > 0 ? rawValue / total : 0;
    });

    return {
      type: "bar" as const,
      name: state,
      x: years,
      y: percentages,
      marker: {
        color: stateColorMapping[state] || "#333333", // Fallback to black if state not in mapping
      },
      text: percentages.map((p) => (p * 100).toFixed(1)),
      textposition: "none",
      hovertemplate:
        "State: %{data.name}<br>Year: %{x}<br>Percentage: %{text}%<extra></extra>",
    };
  });

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: "State Publications Percentage by Year",
    },
    yaxis: {
      showgrid: false,
      tickmode: "linear",
      dtick: 0.25,
      tickformat: ".0%",
      title: {
        text: "Percentage of Publications",
      },
    },
    xaxis: {
      automargin: true,
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
    barmode: "stack",
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
      {selectedStates.length > 0 && stateYearlyData.length > 0 && (
        <>
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
              This stacked bar plot shows the relative contribution of each
              state to the total number of publications under {topic} between{" "}
              {yearRange[0]} and {yearRange[1]}. A total of {totalPublications}{" "}
              publications were retrieved.
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};
