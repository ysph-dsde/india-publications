import { Box, Typography } from "@mui/material";
import Plot from "react-plotly.js";
import { useData } from "../../context/PublicationDataContext";
import { stateColorMapping } from "../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { baseConfig, createLayout } from "./plotConfig";
import { useMemo } from "react";

export const StackedBarPlot = () => {
  const {
    data: { publications: publicationData, stateYearlyData },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
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

  const layout = useMemo<Partial<Plotly.Layout>>(
    () =>
      createLayout({
        title: {
          text: "State Publications Percentage by Year",
        },
        yaxis: {
          tickmode: "linear",
          dtick: 0.25,
          tickformat: ".0%",
          title: {
            text: "Percentage of Publications",
          },
        },
        xaxis: {
          title: {
            text: "Year",
          },
          type: "category",
        },
        barmode: "stack",
      }),
    [],
  );

  return (
    <PlotWrapper>
      <Plot
        data={traces}
        layout={layout}
        config={baseConfig}
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
          This stacked bar plot shows the relative contribution of each state to
          the total number of publications under {customKeyword || topic}{" "}
          between {yearRange[0]} and {yearRange[1]}. A total of{" "}
          {totalPublications} publications were retrieved.
        </Typography>
      </Box>
    </PlotWrapper>
  );
};
