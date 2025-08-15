import { Box, Typography } from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { useData } from "../../context/DataContext";
import { usePopulationData } from "../../context/PopulationContext";

export const ConnectedDotPlot = () => {
  const {
    data: { publications: publicationData },
  } = useData();
  const { populationData } = usePopulationData();

  // Compute publication counts per state
  const pubCounts: { [state: string]: number } = {};
  publicationData.forEach((pub) => {
    const state = pub.institution_state;
    if (state) {
      pubCounts[state] = (pubCounts[state] || 0) + 1;
    }
  });

  const totalPubs = publicationData.length || 1; // Avoid division by zero

  // Get all unique states from both datasets
  const allStates = new Set([
    ...populationData.map((p) => p.state),
    ...Object.keys(pubCounts),
  ]);

  // // Compute data array with proportions and sort by pub - pop difference
  // const data = Array.from(allStates)
  //   .map((state) => {
  //     const pubProp = (pubCounts[state] || 0) / totalPubs;
  //     const popItem = populationData.find((p) => p.state === state);
  //     const popProp = popItem ? popItem.proportion : 0;
  //     return { state, pub: pubProp, pop: popProp, diff: pubProp - popProp };
  //   })
  //   .sort((a, b) => b.diff - a.diff); // Sort by difference (descending)

  // // Transform data for barbell chart: each state needs two points (pub and pop) with same y-value
  // const transformedData = data.flatMap(({ state, pub, pop }) => {
  //   const color = pub > pop ? "green" : "blue";
  //   return [
  //     { state: state, value: pub, type: "publication", color },
  //     { state: state, value: pop, type: "population", color },
  //   ];
  // });

  // console.log(data);

  // Transform data for barbell chart: each state needs two points (pub and pop) with same y-value
  const data = [
    { state: "Alabama", pub: 0.1, pop: 0.12 },
    { state: "Alaska", pub: 0.2, pop: 0.22 },
    { state: "Arizona", pub: 0.15, pop: 0.12 },
  ];

  const transformedData = data.flatMap(({ state, pub, pop }) => {
    const color = pub > pop ? "green" : "blue";
    return [
      { state: state, value: pub, type: "publication", color },
      { state: state, value: pop, type: "population", color },
    ];
  });

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isPop = payload.type === "population";

    const size = 3;

    return isPop ? (
      <rect
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        fill={payload.color}
        stroke={payload.color}
        strokeWidth={2}
        pointerEvents="all"
      />
    ) : (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={payload.color}
        stroke={payload.color}
        strokeWidth={2}
        pointerEvents="all"
      />
    );
  };

  const CustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          bgcolor="white"
          p={1}
          border="1px solid #ccc"
        >
          <Typography>State: {data.state}</Typography>
          <Typography>Type: {data.type}</Typography>
          <Typography>Proportion: {(data.value * 100).toFixed(2)}%</Typography>
        </Box>
      );
    }
    return null;
  };

  // Calculate y-axis ticks with 0.05 increment
  const maxValue = Math.max(...transformedData.map((d) => d.value)); // Find max value
  const maxTick = Math.ceil(maxValue / 0.05) * 0.05; // Round up to nearest 0.05
  const ticks = Array.from(
    { length: Math.floor(maxTick / 0.05) + 1 },
    (_, i) => i * 0.05,
  ); // Generate ticks: [0, 0.05, 0.10, ...]

  return (
    <Box
      height={600}
      width="100%"
    >
      <ResponsiveContainer>
        <ScatterChart
          data={transformedData}
          margin={{ top: 20, right: 0, left: 15, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            type="category"
            dataKey="state"
            label={{ value: "State", position: "bottom" }}
            textAnchor="end"
            allowDuplicatedCategory={false}
            axisLine={false}
            tickLine={false}
            height={250}
            angle={-90}
            style={{ fontSize: "0.75rem" }}
            minTickGap={0}
          />
          <YAxis
            type="number"
            dataKey="value"
            ticks={ticks}
            domain={[0, maxTick]}
            tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
            label={{
              value: "Proportion",
              position: "left",
              angle: -90,
            }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {data.map((entry, index) => (
            <Scatter
              key={`line-${index}`}
              data={transformedData.filter((d) =>
                d.state.includes(entry.state),
              )}
              shape={<CustomDot />}
              line={{ stroke: "grey", strokeWidth: 1.5 }}
              name={entry.state}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
};
