// import { Box, Typography } from "@mui/material";
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   ScatterChart,
//   Scatter,
// } from "recharts";
// import { useData } from "../../context/DataContext";
// import { usePopulationData } from "../../context/PopulationContext";

// export const ConnectedDotPlot = () => {
//   const {
//     data: { publications: publicationData },
//   } = useData();
//   const { populationData } = usePopulationData();

//   // Compute publication counts per state
//   const pubCounts: { [state: string]: number } = {};
//   publicationData.forEach((pub) => {
//     const state = pub.institution_state;
//     if (state) {
//       pubCounts[state] = (pubCounts[state] || 0) + 1;
//     }
//   });

//   const totalPubs = publicationData.length || 1; // Avoid division by zero

//   // Get all unique states from both datasets
//   const allStates = new Set([
//     ...populationData.map((p) => p.state),
//     ...Object.keys(pubCounts),
//   ]);

//   // Compute data array with proportions and sort by pub - pop difference
//   const data = Array.from(allStates)
//     .map((state) => {
//       const pubProp = (pubCounts[state] || 0) / totalPubs;
//       const popItem = populationData.find((p) => p.state === state);
//       const popProp = popItem ? popItem.proportion : 0;
//       return { state, pub: pubProp, pop: popProp, diff: pubProp - popProp };
//     })
//     .sort((a, b) => b.diff - a.diff); // Sort by difference (descending)

//   // Transform data for barbell chart: each state needs two points (pub and pop) with same y-value
//   const transformedData = data.flatMap(({ state, pub, pop }) => {
//     const color = pub > pop ? "green" : "blue";
//     return [
//       { state: state, value: pub, type: "publication", color },
//       { state: state, value: pop, type: "population", color },
//     ];
//   });

//   // console.log(data);

//   // Transform data for barbell chart: each state needs two points (pub and pop) with same y-value
//   // const data = [
//   //   { state: "Alabama", pub: 0.1, pop: 0.12 },
//   //   { state: "Alaska", pub: 0.2, pop: 0.22 },
//   //   { state: "Arizona", pub: 0.15, pop: 0.12 },
//   // ];

//   // const transformedData = data.flatMap(({ state, pub, pop }) => {
//   //   const color = pub > pop ? "green" : "blue";
//   //   return [
//   //     { state: state, value: pub, type: "publication", color },
//   //     { state: state, value: pop, type: "population", color },
//   //   ];
//   // });

//   const categories = data.map((entry) => entry.state);

//   const CustomDot = (props: any) => {
//     const { cx, cy, payload } = props;
//     const isPop = payload.type === "population";

//     const size = 3;

//     return isPop ? (
//       <rect
//         x={cx - size}
//         y={cy - size}
//         width={size * 2}
//         height={size * 2}
//         fill={payload.color}
//         stroke={payload.color}
//         strokeWidth={2}
//       />
//     ) : (
//       <circle
//         cx={cx}
//         cy={cy}
//         r={size}
//         fill={payload.color}
//         stroke={payload.color}
//         strokeWidth={2}
//       />
//     );
//   };

//   const CustomTooltip = ({ active, coordinate }: any) => {
//     console.log({ active, coordinate });

//     if (!active || !coordinate || !categories.length) return null;

//     let closest: any = null;
//     let minDist = Infinity;

//     // Approximate chart dimensions (adjust width if needed)
//     const plotWidth = 800; // Estimate based on ResponsiveContainer; adjust after testing
//     const plotHeight = 1200 - 20 - 20; // Box height minus top/bottom margins
//     const left = 20; // Left margin
//     const top = 0; // Top margin

//     const domainMin = 0;
//     const domainMax = maxTick; // From outer scope
//     const numCategories = categories.length;

//     transformedData.forEach((d) => {
//       // Map data value (proportion) to pixel x-coordinate
//       const xVal = d.value;
//       const pixelX =
//         left + ((xVal - domainMin) / (domainMax - domainMin)) * plotWidth;

//       // Map state to pixel y-coordinate (y-axis is category, inverted)
//       const index = categories.indexOf(d.state);
//       const pixelY =
//         top + plotHeight - ((index + 0.5) * plotHeight) / numCategories;

//       // Calculate distance in pixel space
//       const dist = Math.sqrt(
//         (pixelX - coordinate.x) ** 2 + (pixelY - coordinate.y) ** 2,
//       );

//       if (dist < minDist) {
//         minDist = dist;
//         closest = d;
//       }
//     });

//     if (closest && minDist < 300) {
//       // Reduced threshold for precision
//       return (
//         <Box
//           bgcolor="white"
//           p={1}
//           border="1px solid #ccc"
//         >
//           <Typography>State: {closest.state}</Typography>
//           <Typography>Type: {closest.type}</Typography>
//           <Typography>
//             Proportion: {(closest.value * 100).toFixed(2)}%
//           </Typography>
//         </Box>
//       );
//     }
//     return null;
//   };

//   // Calculate y-axis ticks with 0.05 increment
//   const maxValue = Math.max(...transformedData.map((d) => d.value)); // Find max value
//   const maxTick = Math.ceil(maxValue / 0.05) * 0.05; // Round up to nearest 0.05
//   const ticks = Array.from(
//     { length: Math.floor(maxTick / 0.05) + 1 },
//     (_, i) => i * 0.05,
//   ); // Generate ticks: [0, 0.05, 0.10, ...]

//   return (
//     <Box
//       height={800}
//       width="100%"
//     >
//       <ResponsiveContainer>
//         <ScatterChart margin={{ top: 0, right: 0, left: 20, bottom: 20 }}>
//           <CartesianGrid horizontal={false} />
//           <XAxis
//             type="number"
//             dataKey="value"
//             ticks={ticks}
//             domain={[0, maxTick]}
//             tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
//             label={{
//               value: "Proportion",
//               position: "bottom",
//               // angle: -90,
//             }}
//             tickLine={false}
//             axisLine={false}
//             // type="category"
//             // dataKey="state"
//             // label={{ value: "State", position: "bottom" }}
//             // textAnchor="end"
//             // allowDuplicatedCategory={false}
//             // axisLine={false}
//             // tickLine={false}
//             // height={250}
//             // angle={-90}
//             // style={{ fontSize: "0.75rem" }}
//             // minTickGap={0}
//           />
//           <YAxis
//             // type="number"
//             // dataKey="value"
//             // ticks={ticks}
//             // domain={[0, maxTick]}
//             // tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
//             // label={{
//             //   value: "Proportion",
//             //   position: "left",
//             //   angle: -90,
//             // }}
//             // tickLine={false}
//             // axisLine={false}

//             type="category"
//             dataKey="state"
//             label={{ value: "State", position: "left", angle: -90 }}
//             // textAnchor="end"
//             allowDuplicatedCategory={false}
//             axisLine={false}
//             tickLine={false}
//             width={150}
//             // height={250}
//             // angle={-90}
//             style={{ fontSize: "0.75rem" }}
//             minTickGap={0}
//           />
//           <Tooltip content={<CustomTooltip />} />

//           {data.map((entry, index) => (
//             <Scatter
//               key={`line-${index}`}
//               data={transformedData.filter((d) => d.state === entry.state)}
//               shape={<CustomDot />}
//               line={{ stroke: "grey", strokeWidth: 1.5 }}
//               name={entry.state}
//             />
//           ))}
//         </ScatterChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// import { Box, Typography } from "@mui/material";
// import Chart from "react-apexcharts";

// export const ConnectedDotPlot = () => {
//   // Data in original format
//   const data = [
//     { state: "Alabama", pub: 0.1, pop: 0.12 },
//     { state: "Alaska", pub: 0.2, pop: 0.22 },
//     { state: "Arizona", pub: 0.15, pop: 0.12 },
//   ];

//   // Transform data for ApexCharts rangeBar (dumbbell)
//   const series = data.map(({ state, pub, pop }) => ({
//     data: [
//       {
//         x: state,
//         y: [pub * 100, pop * 100],
//         fillColor: pub > pop ? "#4CAF50" : "#2196F3", // Green if pub > pop, blue otherwise
//       },
//     ],
//   }));

//   const options: ApexCharts.ApexOptions = {
//     chart: {
//       type: "rangeBar",
//       zoom: {
//         enabled: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         isDumbbell: true,
//         dumbbellColors: series.map(({ data }) => [
//           data[0].fillColor,
//           data[0].fillColor,
//         ]),
//       },
//     },
//     title: {
//       text: "Population vs Publication",
//     },
//     legend: {
//       show: false,
//     },
//     tooltip: {
//       custom: ({ seriesIndex, dataPointIndex, w }: any) => {
//         const { x, y } = w.config.series[seriesIndex].data[dataPointIndex];
//         return `
//           <div style="background: white; padding: 8px; border: 1px solid #ccc; font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; font-size: 12px;">
//             <div><strong>State:</strong> ${x}</div>
//             <div><strong>Publication:</strong> ${y[0].toFixed(2)}%</div>
//             <div><strong>Population:</strong> ${y[1].toFixed(2)}%</div>
//           </div>
//         `;
//       },
//     },
//     xaxis: {
//       type: "numeric",
//       min: 0,
//       max:
//         Math.ceil(Math.max(...data.flatMap((d) => [d.pub, d.pop])) / 0.05) * 5,
//       labels: {
//         formatter: (value: string): string => {
//           return `${parseFloat(value).toFixed(0)}%`; // Format as percentage
//         },
//       },
//     },
//     grid: {
//       show: true,
//       xaxis: {
//         lines: {
//           show: true, // Vertical grid lines
//         },
//       },
//       yaxis: {
//         lines: {
//           show: false, // No horizontal grid lines, like your Recharts setup
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false, // Disable default data labels for cleaner look
//     },
//   };

//   return (
//     <Box width="100%">
//       <Chart
//         options={options}
//         series={series}
//         type="rangeBar"
//       />
//     </Box>
//   );
// };

import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { seriesConfig } from "@mui/x-charts/ScatterChart/seriesConfig";
import { useScatterSeries, useXScale, useYScale } from "@mui/x-charts/hooks";

// interface DataPoint {
//   x: number;
//   y: number;
//   id: number;
// }

const tempData = [
  { state: "Alabama", pub: 0.1, pop: 0.12 },
  { state: "Alaska", pub: 0.2, pop: 0.22 },
  { state: "Arizona", pub: 0.15, pop: 0.12 },
];

function LinkPoints({
  seriesId,
  close,
}: {
  seriesId: string;
  close?: boolean;
}) {
  const scatter = useScatterSeries(seriesId);
  const xScale = useXScale();
  const yScale = useYScale();

  if (!scatter) {
    return null;
  }
  const { color, data } = scatter;

  if (!data) {
    return null;
  }

  return (
    <path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d={`M ${data.map(({ x, y }) => `${xScale(x)}, ${yScale(y)}`).join(" L")}${
        close ? "Z" : ""
      }`}
    />
  );
}

function processStateData(data: any) {
  return data.map((item: any, idx: number) => ({
    id: `${idx}`,
    data: [
      { x: item.pub, y: item.pub - item.pop },
      { x: item.pop, y: item.pub - item.pop },
    ],
    label: "Open",
  }));
}

export const ConnectedDotPlot = () => {
  const myData = processStateData(tempData);
  // const data = [
  //   { x: 1, y: 2 },
  //   { x: 3, y: 5 },
  //   // { x: "Category A", y: number },
  //   // { x: "Category B", y: "Value 2", id: 2 },
  //   // { x: "Category A", y: "Value 3", id: 3 },
  //   // { x: "Category C", y: "Value 1", id: 4 },
  // ];
  console.log(myData);

  return (
    <ScatterChart
      width={600}
      height={400}
      series={myData}
      xAxis={[{ label: "X Axis", min: 0, max: 0.25 }]}
      yAxis={[{ label: "Y Axis", min: -0.5, max: 0.5 }]}
    >
      {myData.map((id: string) => (
        <LinkPoints
          key={id}
          seriesId={id}
        />
      ))}
    </ScatterChart>
  );
};
