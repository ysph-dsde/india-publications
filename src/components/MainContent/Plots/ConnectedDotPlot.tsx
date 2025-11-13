import { useData } from "../../../context/PublicationDataContext";
import { usePopulationData } from "../../../context/PopulationContext";
import { useMemo } from "react";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { Title } from "./Title";

interface AggregatedData {
  state: string;
  publicationPercentage: number;
  populationPercentage: number;
  difference: number;
}

export const ConnectedDotPlot = () => {
  const {
    data: { publications: publicationData },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();
  const { endYearPopulationData } = usePopulationData();
  const totalPublications = publicationData.length;

  const aggregatedData = useMemo(() => {
    if (!endYearPopulationData || !publicationData || !selectedStates)
      return [];

    // filter populations to only include selected states
    const filteredPopulations = endYearPopulationData.filter((pop) =>
      selectedStates.includes(pop.state),
    );

    if (totalPublications === 0) {
      return filteredPopulations.map((pop) => ({
        state: pop.state,
        publicationPercentage: 0,
        populationPercentage: pop.proportion,
        difference: 0 - pop.proportion,
      }));
    }

    // Count publications per state
    const pubCounts = publicationData.reduce(
      (map: Map<string, number>, pub) => {
        const state = pub.institution_state?.trim();
        if (state && selectedStates.includes(state)) {
          map.set(state, (map.get(state) || 0) + 1);
        }
        return map;
      },
      new Map<string, number>(),
    );

    // Aggregate data
    const data: AggregatedData[] = filteredPopulations.map((pop) => {
      const pubCount = pubCounts.get(pop.state) || 0;
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
  }, [publicationData, endYearPopulationData, selectedStates]);

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

  // function to find y-axis range
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
    },
    xaxis: {
      range: [-0.5, traces.length / 3 - 1 + 0.5],
      title: {
        text: "State and Union Territory",
        // standoff: 10,
      },
      type: "category",
      dtick: 1,
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
