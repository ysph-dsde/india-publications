import { useEffect, useState } from "react";
import { usePopulationData } from "../../context/PopulationContext";
import { useData } from "../../context/DataContext";
import { ScatterChart, ChartsReferenceLine } from "@mui/x-charts";

// Custom square marker (for population)
const SquareMarker = (props: any) => {
  const { x, y, size = 8 } = props;
  return (
    <rect
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      fill={props.color}
    />
  );
};

export const ConnectedDotPlot = () => {
  const { populationData } = usePopulationData();
  const { data } = useData();
  const { stateYearlyData } = data;
  const [chartData, setChartData] = useState<{
    states: string[];
    pubProportions: { x: string; y: number; color: string }[];
    popProportions: { x: string; y: number; color: string }[];
    connections: {
      state: string;
      pubProp: number;
      popProp: number;
      color: string;
    }[];
  }>({
    states: [],
    pubProportions: [],
    popProportions: [],
    connections: [],
  });

  useEffect(() => {
    const statePubs: { [state: string]: number } = {};
    stateYearlyData.forEach((yearData) => {
      Object.entries(yearData.states).forEach(([state, count]) => {
        statePubs[state] = (statePubs[state] || 0) + count;
      });
    });

    const totalPubs = Object.values(statePubs).reduce(
      (sum, val) => sum + val,
      0,
    );
    const totalPop = populationData.reduce(
      (sum, item) => sum + item.population,
      0,
    );

    const states = [
      ...new Set([
        ...Object.keys(statePubs),
        ...populationData.map((d) => d.state),
      ]),
    ].sort();

    const pubProps = [];
    const popProps = [];
    const connects = [];

    for (const state of states) {
      const pubCount = statePubs[state] || 0;
      const pubProp = totalPubs ? pubCount / totalPubs : 0;
      const popItem = populationData.find((d) => d.state === state);
      const popValue = popItem
        ? popItem.proportion ?? popItem.population / totalPop
        : 0;
      const color = pubProp > popValue ? "green" : "blue";

      pubProps.push({ x: state, y: pubProp, color });
      popProps.push({ x: state, y: popValue, color });
      connects.push({ state, pubProp, popValue, color });
    }

    setChartData({
      states,
      pubProportions: pubProps,
      popProportions: popProps,
      connections: connects,
    });
  }, [populationData, stateYearlyData]);

  return (
    <ScatterChart
      width={800}
      height={400}
      margin={{ bottom: 100 }} // Space for x-axis labels
      series={[
        {
          label: "Publications",
          dataKey: "pub",
          data: chartData.pubProportions.map((d, id) => ({ ...d, id })),
          valueFormatter: (v) => v?.y.toFixed(2),
          color: chartData.pubProportions.map((d) => d.color),
        },
        {
          label: "Population",
          dataKey: "pop",
          data: chartData.popProportions.map((d, id) => ({ ...d, id })),
          valueFormatter: (v) => v?.y.toFixed(2),
          color: chartData.popProportions.map((d) => d.color),
          mark: { component: SquareMarker, size: 8 },
        },
      ]}
      xAxis={[
        {
          scaleType: "band",
          data: chartData.states,
          label: "States",
          tickLabelStyle: { angle: -45, textAnchor: "end" },
        },
      ]}
      yAxis={[{ label: "Proportion", min: 0 }]}
      // tooltip={{ trigger: "item", content: <CustomTooltip /> }}
    >
      {chartData.connections.map((conn) => (
        <ChartsReferenceLine
          key={conn.state}
          segment={[
            { x: conn.state, y: conn.pubProp },
            { x: conn.state, y: conn.popProp },
          ]}
          stroke={conn.color}
          strokeWidth={2}
        />
      ))}
    </ScatterChart>
  );
};
