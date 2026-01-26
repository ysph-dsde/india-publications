import { useData } from "../../../context/PublicationDataContext";
import { usePopulationData } from "../../../context/PopulationContext";
import { useMemo } from "react";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { Title } from "./Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "../../../Theme";

interface AggregatedData {
  state: string;
  publicationPercentage: number;
  populationPercentage: number;
  difference: number;
}

export const ConnectedDotPlot = () => {
  const {
    data: {
      totalPublications: totalPublications,
      totalPublicationsByState: totalPublicationsByState,
    },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();
  const { endYearPopulationData } = usePopulationData();

  const aggregatedData = useMemo(() => {
    if (!endYearPopulationData || !selectedStates || !totalPublicationsByState)
      return [];

    // filter populations to only include selected states
    const filteredPopulations = endYearPopulationData.filter((pop) =>
      selectedStates.includes(pop.state),
    );

    const relevantStatePubs = totalPublicationsByState.filter((item) =>
      selectedStates.includes(item.state),
    );

    const totalPubs = relevantStatePubs.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    if (totalPubs === 0) {
      return filteredPopulations.map((pop) => ({
        state: pop.state,
        publicationPercentage: 0,
        populationPercentage: pop.proportion,
        difference: -pop.proportion,
      }));
    }

    const statePubMap = new Map(
      relevantStatePubs.map((item) => [item.state, item.count]),
    );

    // Aggregate data
    const data: AggregatedData[] = filteredPopulations.map((pop) => {
      const pubCount = statePubMap.get(pop.state) || 0;
      const pubPerc = pubCount / totalPublications;
      const popPerc = pop.proportion;
      return {
        state: pop.state,
        publicationPercentage: pubPerc,
        populationPercentage: popPerc,
        difference: pubPerc - popPerc,
      };
    });

    // Sort by descending difference
    data.sort((a, b) => b.difference - a.difference);

    return data;
  }, [endYearPopulationData, selectedStates, totalPublicationsByState]);

  // Prepare Plotly traces
  const traces = useMemo(() => {
    if (!aggregatedData.length) {
      return [];
    }

    const data: Plotly.Data[] = [];
    aggregatedData.forEach((state, i) => {
      const datum = aggregatedData[i];
      const pub = datum.publicationPercentage;
      const pop = datum.populationPercentage;
      const dif = datum.difference;
      const isGreen = pub > pop;
      const hoverText = `<b>${datum.state}</b><br>Publication percentage: ${(
        pub * 100
      ).toFixed(1)}%<br>Population percentage: ${(pop * 100).toFixed(
        1,
      )}%<br>Difference: ${(dif * 100).toFixed(1).replace("-0.0", "0.0")}%`;

      // Trace for publication (circle markers)
      data.push({
        type: "scatter",
        y: [pub],
        x: [datum.state],
        mode: "markers",
        name: `${state} (Publication)`,
        marker: {
          color: isGreen ? "#4CAF50" : "#FF9800",
          symbol: "circle",
          size: 12,
        },
        showlegend: false,
        text: [hoverText],
        hoverinfo: "text",
      });

      // Trace for population (square markers)
      data.push({
        type: "scatter",
        y: [pop],
        x: [datum.state],
        mode: "markers",
        name: `${state} (Population)`,
        marker: {
          color: isGreen ? "#4CAF50" : "#FF9800",
          symbol: "square",
          size: 12,
        },
        showlegend: false,
        text: [hoverText],
        hoverinfo: "text",
      });

      // Trace for the connecting line
      data.push({
        type: "scatter",
        y: [pub, pop], // Two points to connect
        x: [datum.state, datum.state],
        mode: "lines",
        name: `${state} (Line)`,
        line: {
          color: isGreen ? "#4CAF50" : "#FF9800",
          width: 2,
        },
        showlegend: false,
        hoverinfo: "none",
      });
    });
    return data;
  }, [aggregatedData]);

  const dtick = 0.05;

  // find y-axis range
  const findMinMax = (): [min: number, max: number] => {
    const allVals = aggregatedData.flatMap((obj) => [
      obj.populationPercentage,
      obj.publicationPercentage,
    ]);

    return [
      Math.floor(Math.min(...allVals) / dtick) * dtick - 0.01,
      Math.ceil(Math.max(...allVals) / dtick) * dtick + 0.01,
    ];
  };

  const layout: Partial<Plotly.Layout> = {
    yaxis: {
      tickmode: "linear",
      dtick: dtick,
      tickformat: ".0%",
      title: {
        text: "Percentage",
      },
      showgrid: true,
      range: findMinMax(),

      tickfont: { size: 16 },
    },
    xaxis: {
      range: [-0.5, traces.length / 3 - 1 + 0.5],
      type: "category",
      dtick: 1,
      
      tickfont: { size: 16 },
    },
    margin: {
      r: 20,
      l: 70,
    },
  };

  return (
    <PlotWrapper>
      <Title>Population vs. Publication by State and Union Territory</Title>
      <CustomPlot
        data={traces}
        layout={layout}
        style={{ minHeight: 600 }}
      />
      <Box sx={{ width: "100%", textAlign: "center", pt: 1.5, pb: 2 }}>
        <Typography
          color={theme.palette.secondary.main}
          fontWeight="bold"
          fontSize={18}
        >
          State and Union Territory
        </Typography>
      </Box>
      <PlotCaption>
        This plot compares the publication share versus the population share
        across selected Indian states / territories for {customKeyword || topic}{" "}
        between the years of {yearRange[0]} and {yearRange[1]}. The population
        percentage is based on {yearRange[1]} population data. A total of{" "}
        {totalPublications} publications were retrieved. Lines connect each
        state's publication share (circle) with its population share (square),
        highlighting over-representation (green) or under-representation
        (orange).
      </PlotCaption>
    </PlotWrapper>
  );
};
