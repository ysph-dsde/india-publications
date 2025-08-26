import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/PublicationDataContext";
import { theme } from "../../Theme";
import { States } from "../../constants/States";

// interface GeoJSONData {
//   type: string;
//   features: Array<{
//     type: string;
//     geometry: {
//       type: string;
//       coordinates: number[][][][] | number[][][];
//     };
//     properties: {
//       State_Name: string;
//     };
//   }>;
// }

export const GeoPlot = () => {
  const {
    data: { publications: publicationData, totalPublicationsByState },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic },
  } = useData();
  const totalPublications = publicationData.length;

  const [geojson, setGeojson] = useState<any>(null);

  const completePublicationsByState = [
    // add states with zero publications if they are selected
    ...selectedStates
      .filter(
        (state) => !totalPublicationsByState.some((pub) => pub.state === state),
      )
      .map((state) => ({
        state: state,
        count: 0,
      })),
    // update state names to match those in the geojson
    ...totalPublicationsByState.map((item) => {
      if (item.state === "Andaman and Nicobar") {
        return { ...item, state: "Andaman & Nicobar" };
      } else if (item.state === "Jammu and Kashmir") {
        return { ...item, state: "Jammu & Kashmir" };
      }
      return item;
    }),
  ];

  const allStates = [
    // update state names to match those in the geojson
    ...States.map((item) => {
      if (item === "Andaman and Nicobar") {
        return "Andaman & Nicobar";
      } else if (item === "Jammu and Kashmir") {
        return "Jammu & Kashmir";
      }
      return item;
    }),
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GeoJSON
        const geojsonResponse = await fetch(
          "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson",
        );
        const geojsonData = await geojsonResponse.json();
        console.log("Theirs", geojsonData);
        setGeojson(geojsonData);

        const geojsonResponse2 = await fetch("/India_State_Boundary4.json");
        const geojsonData2 = await geojsonResponse2.json();
        console.log("mine", geojsonData2);

        // setGeojson(geojsonData2);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const plotData: Plotly.Data[] = useMemo(() => {
    return [
      // trace for unselected states
      {
        type: "choropleth",
        locationmode: "geojson-id",
        geojson: geojson,
        // featureidkey: "properties.State_Name",
        featureidkey: "properties.ST_NM",
        locations: allStates.map((state) => state),
        z: allStates.map((_state) => 0),
        colorscale: [
          [0, "white"],
          [1, "white"],
        ],
        marker: { line: { color: "black" } }, // state borders
        hovertemplate: "%{location}<extra></extra>",
        showscale: false,
      },
      // trace for selected states
      {
        type: "choropleth",
        locationmode: "geojson-id",
        geojson: geojson,
        // featureidkey: "properties.State_Name",
        featureidkey: "properties.ST_NM",
        locations: completePublicationsByState.map((d) => d.state),
        z: completePublicationsByState.map((d) => d["count"]),
        colorscale: "Blues",
        reversescale: true,
        colorbar: {
          title: { text: "Publication Count" },
          thickness: 15,
          tick0: 0,
          nticks: 5,
          lenmode: "fraction",
          len: 0.3,
          yanchor: "bottom",
          y: 0.05,
          xanchor: "right",
          x: 0.97,
          bordercolor: `${theme.palette.primary.main}`,
          borderwidth: 2,
          borderradius: 4,
        },
        marker: { line: { color: "black" } }, // state borders
        hovertemplate: "%{location}: %{z} publications<extra></extra>",
      },
    ];
  }, [totalPublicationsByState, geojson]);

  const layout: Partial<Plotly.Layout> = {
    geo: {
      visible: false,
      fitbounds: "locations",
      projection: {
        type: "conic conformal",
        parallels: [12.472944444, 35.172805555556],
        rotation: { lat: 24, lon: 80 },
      },
      scale: 1,
    },
    hovermode: "closest",
    hoverlabel: {
      bgcolor: "white",
    },
    autosize: true,
    dragmode: false,
    margin: { r: 0, t: 0, b: 0, l: 0 },
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
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{
          width: "100%",
          minHeight: 600,
          borderRadius: 4,
        }}
        useResizeHandler
      />
      <Box
        px={2}
        pb={1}
      >
        <Typography variant="caption">
          This plot shows the number of publications under {topic} between the
          years of {yearRange[0]} and {yearRange[1]}. A total of{" "}
          {totalPublications} publications were retrieved.
        </Typography>
      </Box>
    </Paper>
  );
};
