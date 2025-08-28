import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/PublicationDataContext";
import { theme } from "../../Theme";
import { States as allStates } from "../../constants/States";
import geojson from "../../assets/states_geo.json";
import { PlotWrapper } from "./PlotWrapper";
import { baseConfig, createLayout } from "./plotConfig";
import { PlotCaption } from "./PlotCaption";

export const GeoPlot = () => {
  const {
    data: { publications: publicationData, totalPublicationsByState },
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

  const layout = useMemo<Partial<Plotly.Layout>>(
    () =>
      createLayout({
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
        hoverdistance: -1,
        margin: { r: 0, t: 0, b: 0, l: 0 },
      }),
    [],
  );

  return (
    <PlotWrapper>
      <Plot
        data={plotData}
        layout={layout}
        config={baseConfig}
        style={{
          width: "100%",
          minHeight: 800,
          borderRadius: 4,
        }}
        useResizeHandler
      />
      <PlotCaption>
        This plot shows the number of publications under{" "}
        {customKeyword || topic} between the years of {yearRange[0]} and{" "}
        {yearRange[1]}. A total of {totalPublications} publications were
        retrieved.
      </PlotCaption>
    </PlotWrapper>
  );
};
