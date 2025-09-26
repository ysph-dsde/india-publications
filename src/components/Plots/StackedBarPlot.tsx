import { useData } from "../../context/PublicationDataContext";
import { stateColorMapping } from "../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { useMemo } from "react";
import { usePopulationData } from "../../context/PopulationContext";
import { ToggleViewButtons } from "./ToggleViewButtons";
import type { LayoutAxis } from "plotly.js";
import { Legend } from "./Legend";

interface StackedBarPlotProps {
  view: string;
  setView: Function;
}

export const StackedBarPlot = ({ view, setView }: StackedBarPlotProps) => {
  const {
    data: { publications: publicationData, stateYearlyData },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();
  const { populationData, endYearPopulationData } = usePopulationData();
  const totalPublications = publicationData.length;

  // extract years from data
  const years = stateYearlyData.map((item) => item.year);

  // calculate yearly totals
  const yearlyTotals = useMemo(() => {
    return stateYearlyData.map((item) => {
      return selectedStates.reduce((sum, state) => {
        return sum + (item.states[state] || 0);
      }, 0);
    });
  }, [stateYearlyData, selectedStates]);

  // sort states alphabetically
  const sortedStates = [...selectedStates].sort((a, b) => b.localeCompare(a));

  // build traces (one per state)
  const publicationTraces: Plotly.Data[] = useMemo(() => {
    return sortedStates.map((state) => {
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
        xaxis: "x",
        yaxis: "y",
        marker: {
          color: stateColorMapping[state] || "#333333", // Fallback to black if state not in mapping
        },
        text: percentages.map((p) => (p * 100).toFixed(1)),
        textposition: "none",
        hovertemplate:
          "State: %{data.name}<br>Year: %{x}<br>Percentage: %{text}%<extra></extra>",
      };
    });
  }, [stateYearlyData, sortedStates, years, yearlyTotals]);

  const yearRangeEndTrace: Plotly.Data[] = useMemo(() => {
    const filteredAndSortedData = endYearPopulationData
      .filter((data) => sortedStates.includes(data.state))
      .sort((a, b) => b.state.localeCompare(a.state));

    return filteredAndSortedData.map((data) => {
      return {
        type: "bar" as const,
        name: data.state,
        x: [yearRange[1]],
        y: [data.proportion],
        xaxis: "x2",
        yaxis: "y2",
        marker: {
          color: stateColorMapping[data.state] || "#333333", // Fallback to black if state not in mapping
        },
        showlegend: false,
        text: [(data.proportion * 100).toFixed(1)],
        textposition: "none",
        hovertemplate:
          "State: %{data.name}<br>Year: %{x}<br>Percentage: %{text}%<extra></extra>",
      };
    });
  }, [endYearPopulationData]);

  const populationTraces: Plotly.Data[] = useMemo(() => {
    const popTraces: Plotly.Data[] = [];

    for (let year of years) {
      const yearData = populationData.get(year.toString());

      if (!yearData) {
        // Skip if no data for this year (optional: add logging if needed)
        continue;
      }
      const filteredAndSortedData = yearData
        .filter((data) => sortedStates.includes(data.state))
        .sort((a, b) => b.state.localeCompare(a.state));

      filteredAndSortedData.forEach((data) => {
        popTraces.push({
          type: "bar" as const,
          name: data.state,
          x: [year],
          y: [data.proportion],
          xaxis: "x",
          yaxis: "y2",
          marker: {
            color: stateColorMapping[data.state] || "#333333", // Fallback to black if state not in mapping
          },
          showlegend: false,
          text: [(data.proportion * 100).toFixed(1)],
          textposition: "none",
          hovertemplate:
            "State: %{data.name}<br>Year: %{x}<br>Percentage: %{text}%<extra></extra>",
        });
      });
    }
    return popTraces;
  }, [endYearPopulationData]);

  const combinedTraces: Plotly.Data[] = useMemo(() => {
    return view === "yearRangeEnd"
      ? [...publicationTraces, ...yearRangeEndTrace]
      : [...publicationTraces, ...populationTraces];
  }, [publicationTraces, yearRangeEndTrace, populationTraces]);

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: "State and Territory Publications Percentage by Year",
    },
    barmode: "stack",
  };

  const standardYAxis: Partial<LayoutAxis> = {
    tickmode: "linear",
    dtick: 0.25,
    tickformat: ".0%",
    title: {
      text: "Percentage of Publications",
    },
  };

  const barWidthFormatter =
    (1 / (yearRange[1] - yearRange[0] + 2)) * (yearRange[1] - yearRange[0] + 1);

  const yearRangeEndLayout: Partial<Plotly.Layout> = {
    ...layout,
    yaxis: {
      ...standardYAxis,
    },
    xaxis: {
      title: {
        text: "Publication Percentage",
      },
      type: "category",
      domain: [0, barWidthFormatter - 0.02],
    },
    xaxis2: {
      title: {
        text: "Population Percentage",
      },
      type: "category",
      domain: [barWidthFormatter + 0.02, 1],
    },
    yaxis2: {
      showticklabels: false,
      showgrid: false,
    },
    grid: {
      rows: 1,
      columns: 2,
      pattern: "independent",
      subplots: ["x", "x2"],
    },
  };

  const allYearsLayout: Partial<Plotly.Layout> = {
    ...layout,
    yaxis: {
      ...standardYAxis,
      domain: [0.53, 1],
    },
    yaxis2: {
      ...standardYAxis,
      title: {
        text: "Percentage of Population",
      },
      domain: [0, 0.47],
      showgrid: false,
    },
    xaxis: {
      type: "category",
    },
    grid: {
      rows: 2,
      columns: 1,
      subplots: ["y", "y2"],
    },
  };

  return (
    <PlotWrapper>
      <CustomPlot
        data={combinedTraces}
        layout={view === "yearRangeEnd" ? yearRangeEndLayout : allYearsLayout}
      />
      <Legend />
      <PlotCaption>
        This stacked bar plot shows the relative contribution of each state /
        territory to the total number of publications under{" "}
        {customKeyword || topic} between {yearRange[0]} and {yearRange[1]}. A
        total of {totalPublications} publications were retrieved.
      </PlotCaption>
      <ToggleViewButtons
        view={view}
        setView={setView}
        view1value="yearRangeEnd"
        view2value="allPopulations"
        view1text="Year range end population"
        view2text="All year populations"
      />
    </PlotWrapper>
  );
};
