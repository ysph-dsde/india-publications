import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/PublicationDataContext";
import { theme } from "../../Theme";
import { States as allStates } from "../../constants/States";
import geojson from "../../assets/states_geo.json";
import { PlotWrapper } from "./PlotWrapper";

export const GeoPlot = () => {
  const {
    data: { publications: publicationData, totalPublicationsByState, loading },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();
  const totalPublications = publicationData.length;

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
    ...totalPublicationsByState,
  ];

  const plotData: Plotly.Data[] = useMemo(() => {
    return [
      // trace for unselected states
      {
        type: "choropleth",
        locationmode: "geojson-id",
        geojson: geojson,
        featureidkey: "properties.name",
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
        featureidkey: "properties.name",
        locations: completePublicationsByState.map((state) => state.state),
        z: completePublicationsByState.map((state) => state["count"]),
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
  }, [totalPublicationsByState]);

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
    hoverdistance: -1,
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
    <PlotWrapper show={!loading}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{
          width: "100%",
          minHeight: 800,
          borderRadius: 4,
        }}
        useResizeHandler
      />
      <Box
        px={2}
        pb={1}
      >
        <Typography variant="caption">
          This plot shows the number of publications under{" "}
          {customKeyword || topic} between the years of {yearRange[0]} and{" "}
          {yearRange[1]}. A total of {totalPublications} publications were
          retrieved.
        </Typography>
      </Box>
    </PlotWrapper>
  );
};
