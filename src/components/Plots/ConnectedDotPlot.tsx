// import { useEffect, useState } from "react";
// import { usePopulationData } from "../../context/PopulationContext";
// import { useData } from "../../context/DataContext";
// import {
//   useXAxis,
//   useYAxis,
//   ScatterChart,
//   useScatterSeries,
//   type ChartsLabelCustomMarkProps,
//   type ScatterMarkerProps,
// } from "@mui/x-charts";

// const CustomMarker = ({
//   size,
//   x,
//   y,
//   seriesId,
//   isHighlighted,
//   isFaded,
//   dataIndex,
//   color,
//   ...other
// }: ScatterMarkerProps) => {
//   const scale = (isHighlighted ? 1.2 : 1) * size;
//   const props = {
//     transform: `translate(${x}, ${y})`,
//     fill: color,
//     opacity: isFaded ? 0.3 : 1,
//     ...other,
//   };

//   return (
//     <g {...props}>
//       {seriesId === "0" ? (
//         <circle
//           cx={0}
//           cy={0}
//           r={scale / 2} // Radius is half the size to match the diameter
//         />
//       ) : (
//         <rect
//           x={-scale / 2}
//           y={-scale / 2}
//           width={scale}
//           height={scale}
//         />
//       )}
//     </g>
//   );
// };

// const CircleLabelMark = ({ color, ...props }: ChartsLabelCustomMarkProps) => {
//   return (
//     <svg viewBox="-7.423 -7.423 14.846 14.846">
//       <circle
//         cx={0}
//         cy={0}
//         r={7.423}
//         fill={color}
//         {...props}
//       />
//     </svg>
//   );
// };

// const SquareLabelMark = ({ color, ...props }: ChartsLabelCustomMarkProps) => {
//   return (
//     <svg viewBox="-7.423 -7.423 14.846 14.846">
//       <rect
//         x={-7.423}
//         y={-7.423}
//         width={14.846}
//         height={14.846}
//         fill={color}
//         {...props}
//       />
//     </svg>
//   );
// };

// export const ConnectedDotPlot = () => {
//   // const { populationData } = usePopulationData();
//   // const {
//   //   data: { stateYearlyData },
//   // } = useData();
//   // const [chartData, setChartData] = useState<{
//   //   states: string[];
//   //   pubProportions: { x: number; y: number; color: string; id: number }[];
//   //   popProportions: { x: number; y: number; color: string; id: number }[];
//   //   connections: {
//   //     state: string;
//   //     pubProp: number;
//   //     popProp: number;
//   //     color: string;
//   //   }[];
//   // }>({
//   //   states: [],
//   //   pubProportions: [],
//   //   popProportions: [],
//   //   connections: [],
//   // });

//   // useEffect(() => {
//   //   const statePubs: { [state: string]: number } = {};
//   //   stateYearlyData.forEach((yearData) => {
//   //     Object.entries(yearData.states).forEach(([state, count]) => {
//   //       statePubs[state] = (statePubs[state] || 0) + count;
//   //     });
//   //   });

//   //   const totalPubs = Object.values(statePubs).reduce(
//   //     (sum, val) => sum + val,
//   //     0,
//   //   );
//   //   const totalPop = populationData.reduce(
//   //     (sum, item) => sum + item.population,
//   //     0,
//   //   );

//   //   const states = [
//   //     ...new Set([
//   //       ...Object.keys(statePubs),
//   //       ...populationData.map((d) => d.state),
//   //     ]),
//   //   ].sort();

//   //   const pubProps: { x: number; y: number; color: string; id: number }[] = [];
//   //   const popProps: { x: number; y: number; color: string; id: number }[] = [];
//   //   const connects: {
//   //     state: string;
//   //     pubProp: number;
//   //     popProp: number;
//   //     color: string;
//   //   }[] = [];

//   //   states.forEach((state, index) => {
//   //     const pubCount = statePubs[state] || 0;
//   //     const pubProp = totalPubs ? pubCount / totalPubs : 0;
//   //     const popItem = populationData.find((d) => d.state === state);
//   //     const popValue = popItem
//   //       ? popItem.proportion ?? popItem.population / totalPop
//   //       : 0;
//   //     const color = pubProp > popValue ? "green" : "blue";

//   //     pubProps.push({ x: index, y: pubProp, color, id: index });
//   //     popProps.push({ x: index, y: popValue, color, id: index });
//   //     connects.push({ state, pubProp, popProp: popValue, color });
//   //   });

//   //   setChartData({
//   //     states,
//   //     pubProportions: pubProps,
//   //     popProportions: popProps,
//   //     connections: connects,
//   //   });
//   // }, [populationData, stateYearlyData]);

//   const testChartData = [
//     { state: "Alabama", pub: 0.1, pop: 0.12, color: "green" },
//     { state: "Alaska", pub: 0.2, pop: 0.22, color: "blue" },
//     { state: "Arizona", pub: 0.15, pop: 0.18, color: "green" },
//   ];

//   return (
//     <ScatterChart
//       sx={{ width: "100%" }}
//       height={900}
//       margin={{ bottom: 500 }} // Space for x-axis labels
//       series={[
//         {
//           id: "0",
//           label: "Publications",
//           // dataKey: "pub",
//           data: testChartData.pubProportions,
//           valueFormatter: (v: { x: number; y: number } | null) =>
//             v ? v.y.toFixed(2) : null,
//           markerSize: 8,
//           labelMarkType: CircleLabelMark,
//         },
//         {
//           id: "1",
//           label: "Population",
//           // dataKey: "pop",
//           data: testChartData.popProportions,
//           valueFormatter: (v: { x: number; y: number } | null) =>
//             v ? v.y.toFixed(2) : null,
//           markerSize: 8,
//           labelMarkType: SquareLabelMark,
//         },
//       ]}
//       slots={{ marker: CustomMarker }}
//       xAxis={[
//         {
//           id: "states",
//           valueFormatter: (value: number) => testChartData.states[value] || "",
//           // label: "States",
//           tickMinStep: 1,
//           // tickLabelStyle: { angle: -45, textAnchor: "start" },
//         },
//       ]}
//       yAxis={[{ id: "prop", label: "Proportion", min: 0 }]}
//     ></ScatterChart>
//   );
// };

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const CustomConnectingLines = ({ data, xAxis, yAxis }: any) => {
  // Get the X and Y axis scales
  const xScale = xAxis.scale;
  const yScale = yAxis.scale;

  // Map data to SVG lines
  return data.map((entry: any, index: any) => {
    const x = xScale(entry.state); // X-coordinate for the state
    const y1 = yScale(entry.pub); // Y-coordinate for pub
    const y2 = yScale(entry.pop); // Y-coordinate for pop

    return (
      <line
        key={`line-${index}`}
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={entry.color || "black"} // Use data's color or fallback
        strokeWidth={2}
      />
    );
  });
};

// export const ConnectedDotPlot = () => {
//   const testChartData = [
//     { state: "Alabama", pub: 0.1, pop: 0.12, color: "green" },
//     { state: "Alaska", pub: 0.2, pop: 0.22, color: "blue" },
//     { state: "Arizona", pub: 0.15, pop: 0.18, color: "green" },
//   ];

//   return (
//     <ResponsiveContainer
//       width="100%"
//       height={400}
//     >
//       <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
//         <CartesianGrid />
//         <XAxis
//           dataKey="state"
//           type="category"
//           name="State"
//           allowDuplicatedCategory={false}
//         />
//         <YAxis
//           name="Proportion"
//           label={{ value: "Proportion", angle: -90, position: "insideLeft" }}
//           domain={[0, "auto"]}
//         />
//         <Tooltip />
//         <Legend />
//         <Scatter
//           name="Publications"
//           data={testChartData}
//           dataKey="pub"
//         />
//         <Scatter
//           name="Population"
//           data={testChartData}
//           dataKey="pop"
//           shape="square"
//         />
//         <CustomConnectingLines data={testChartData} />
//       </ScatterChart>
//     </ResponsiveContainer>
//   );
// };

// Define the shape of your data
interface ChartData {
  state: string;
  pub: number;
  pop: number;
  color: string;
}

interface BarbellChartProps {
  data: ChartData[];
}

export const ConnectedDotPlot: React.FC<BarbellChartProps> = () => {
  // Transform data for barbell chart: each state needs two points (pub and pop) with same y-value

  const data = [
    { state: "Alabama", pub: 0.1, pop: 0.12, color: "green" },
    { state: "Alaska", pub: 0.2, pop: 0.22, color: "blue" },
    { state: "Arizona", pub: 0.15, pop: 0.18, color: "green" },
  ];

  const transformedData = data.flatMap(({ state, pub, pop, color }) => [
    { state: state, value: pub, type: "pub", color },
    { state: state, value: pop, type: "pop", color },
  ]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="state"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
            allowDuplicatedCategory={false}
          />
          <YAxis
            label={{ value: "Values", angle: -90, position: "insideLeft" }}
            domain={[0, "auto"]}
          />
          <Tooltip />
          <Legend />
          {data.map((entry, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey="value"
              data={transformedData.filter(
                (d) => d.color === entry.color && d.state.includes(entry.state),
              )}
              stroke={entry.color}
              strokeWidth={2}
              dot={{ r: 6 }}
              connectNulls={false}
              name={entry.state}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
