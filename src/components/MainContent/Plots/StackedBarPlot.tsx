import { useData } from "../../../context/PublicationDataContext";
import { stateColorMapping } from "../../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { useMemo } from "react";
import { usePopulationData } from "../../../context/PopulationContext";
import { ToggleViewButtons } from "./ToggleViewButtons";
import type { LayoutAxis } from "plotly.js";
import { Legend } from "./Legend";
import { theme } from "../../../Theme";
import { Title } from "./Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

interface StackedBarPlotProps {
  view: string;
  setView: Function;
}

export const StackedBarPlot = ({ view, setView }: StackedBarPlotProps) => {
  const {
    data: { totalPublications: totalPublications, stateYearlyData },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();
  const { populationData, endYearPopulationData } = usePopulationData();

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

  // sort states reverse alphabetically (so graph has A --> Z from top --> bottom)
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
          color: stateColorMapping[state] || theme.palette.gray.dark, // Fallback to gray if state not in mapping
        },
        text: percentages.map((p) => (p * 100).toFixed(1)),
        textposition: "none",
        hovertemplate:
          "State: %{data.name}<br>Year: %{x}<br>Percentage: %{text}%<extra></extra>",
      };
    });
  }, [stateYearlyData, sortedStates, years, yearlyTotals]);

  // population trace for year at end of year range
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
        xaxis: "x",
        yaxis: "y",
        marker: {
          color: stateColorMapping[data.state] || theme.palette.gray.dark,
        },
        showlegend: false,
        text: [(data.proportion * 100).toFixed(1)],
        textposition: "none",
        hovertemplate:
          "State: %{data.name}<br>Year: %{x}<br>Percentage: %{text}%<extra></extra>",
      };
    });
  }, [endYearPopulationData]);

  // population traces for each year within year range
  const populationTraces: Plotly.Data[] = useMemo(() => {
    const popTraces: Plotly.Data[] = [];

    for (let year of years) {
      const yearData = populationData.get(year.toString());

      if (!yearData) {
        // Skip if no data for this year (shouldn't happen, but just in case)
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
          yaxis: "y",
          marker: {
            color: stateColorMapping[data.state] || theme.palette.gray.dark,
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

  const layout: Partial<Plotly.Layout> = {
    barmode: "stack",
    margin: { l: 0, r: 0, b: 0 },
    xaxis: {
      type: "category",
    },
  };

  const standardYAxis: Partial<LayoutAxis> = {
    tickmode: "linear",
    dtick: 0.25,
    tickformat: ".0%",
  };

  const yearRangeEndPublicationsLayout: Partial<Plotly.Layout> = {
    ...layout,
    yaxis: {
      ...standardYAxis,
      title: {
        text: "Percentage of Publications",
      },
    },
  };

  const yearRangeEndPopulationLayout: Partial<Plotly.Layout> = {
    ...layout,
    yaxis: {
      ...standardYAxis,
      title: {
        text: "Percentage of Population",
      },
      showticklabels: false,
    },
  };

  const allYearsPublicationsLayout: Partial<Plotly.Layout> = {
    ...layout,
    yaxis: {
      ...standardYAxis,
      title: {
        text: "Percentage of Publications",
      },
    },
  };

  const allYearsPopulationLayout: Partial<Plotly.Layout> = {
    ...layout,
    yaxis: {
      ...standardYAxis,
      title: {
        text: "Percentage of Population",
      },
    },
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const AllYears = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: 2,
        }}
      >
        <Box>
          <CustomPlot
            data={publicationTraces}
            layout={allYearsPublicationsLayout}
            style={{ minHeight: isMobile ? 250 : 300 }}
          />
        </Box>
        <Box>
          <CustomPlot
            data={populationTraces}
            layout={allYearsPopulationLayout}
            style={{ minHeight: isMobile ? 250 : 300 }}
          />
        </Box>
      </Box>
    );
  };

  const YearEnd = () => {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: ".8fr .2fr",
          gap: 2,
          px: 2,
        }}
      >
        <Box>
          <CustomPlot
            data={publicationTraces}
            layout={yearRangeEndPublicationsLayout}
          />
        </Box>
        <Box>
          <CustomPlot
            data={yearRangeEndTrace}
            layout={yearRangeEndPopulationLayout}
          />
        </Box>
      </Box>
    );
  };

  // built customly as opposed to using various plotly features for styling purposes.
  return (
    <PlotWrapper>
      <Title>State and Union Territory Publications Percentage by Year</Title>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {view === "yearRangeEnd" ? <YearEnd /> : <AllYears />}
        <Box sx={{ width: "100%", textAlign: "center", pt: 1.5 }}>
          <Typography
            color={theme.palette.secondary.main}
            fontWeight="bold"
            fontSize={18}
          >
            Year
          </Typography>
        </Box>
      </Box>
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
