import { useData } from "../../context/PublicationDataContext";
import { usePopulationData } from "../../context/PopulationContext";
import { useMemo } from "react";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";

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
  const { populationData } = usePopulationData();
  const totalPublications = publicationData.length;

  const aggregatedData = useMemo(() => {
    if (!populationData || !publicationData || !selectedStates) return [];

    // filter populations to only include selected states
    const filteredPopulations = populationData.filter((pop) =>
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
  }, [publicationData, populationData, selectedStates]);

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
      const isGreen = pub > pop;
      const hoverText = `<b>${datum.state}</b><br>Publication percentage: ${(
        pub * 100
      ).toFixed(1)}%<br>Population percentage: ${(pop * 100).toFixed(1)}%`;

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

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: "Population vs. Publication by State",
    },
    yaxis: {
      tickmode: "linear",
      dtick: 0.05,
      tickformat: ".0%",
      title: {
        text: "Percentage",
      },
    },
    xaxis: {
      range: [0.5, traces.length / 3 - 1 + 0.5],
      showgrid: true,
      title: {
        text: "State",
        standoff: 0,
      },
      type: "category",
    },
    margin: {
      r: 30,
    },
  };

  return (
    <PlotWrapper>
      <CustomPlot
        data={traces}
        layout={layout}
      />
      <PlotCaption>
        This plot compares the publication share versus the population share
        across selected Indian states for {customKeyword || topic} between the
        years of {yearRange[0]} and {yearRange[1]}. The population percentage is
        based on 2025 population data. A total of {totalPublications}{" "}
        publications were retrieved. Lines connect each state's publication
        share (circle) with its population share (square), highlighting
        over-representation (green) or under-representation (blue).
      </PlotCaption>
    </PlotWrapper>
  );
};
