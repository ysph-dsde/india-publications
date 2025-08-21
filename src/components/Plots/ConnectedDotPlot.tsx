import { Paper } from "@mui/material";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import { usePopulationData } from "../../context/PopulationContext";
import { useMemo } from "react";

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
  } = useData();
  const { populationData } = usePopulationData();

  // const state = ["Alabama", "Alaska", "Arizona"];

  // const publicationData = [0.1, 0.2, 0.15];

  // const populationData = [0.12, 0.22, 0.12];

  const aggregatedData = useMemo(() => {
    if (!populationData || !publicationData || !selectedStates) return [];

    // filter populations to only include selected states
    const filteredPublications = populationData.filter((pop) =>
      selectedStates.includes(pop.state),
    );

    const totalPublications = publicationData.length;
    if (totalPublications === 0) {
      return filteredPublications.map((pop) => ({
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
    const data: AggregatedData[] = filteredPublications.map((pop) => {
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
    aggregatedData.forEach((c, i) => {
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
        name: `${c} (Voting Pop)`,
        marker: {
          color: isGreen ? "#4CAF50" : "#2196F3",
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
        name: `${c} (Reg Voters)`,
        marker: {
          color: isGreen ? "#4CAF50" : "#2196F3",
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
        name: `${c} (Line)`,
        line: {
          color: isGreen ? "#4CAF50" : "#2196F3",
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
      showgrid: false,
      tickmode: "linear",
      dtick: 0.05,
      tickformat: ".0%",
      title: {
        text: "Percentage",
      },
    },
    xaxis: {
      automargin: true,
    },
    hovermode: "closest",
    hoverlabel: {
      bgcolor: "white",
    },
    autosize: true,
    dragmode: false,
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
      {selectedStates.length > 0 && (
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
      )}
    </Paper>
  );
};
