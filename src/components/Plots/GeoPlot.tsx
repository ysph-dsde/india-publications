import { useMemo } from "react";
import { useData } from "../../context/PublicationDataContext";
import { theme } from "../../Theme";
import { States as allStates } from "../../constants/States";
import geojson from "../../assets/states_geo.json";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { usePopulationData } from "../../context/PopulationContext";
import { ToggleViewButtons } from "./ToggleViewButtons";

interface GeoPlotProps {
  view: string;
  setView: Function;
}

export const GeoPlot = ({ view, setView }: GeoPlotProps) => {
  const {
    data: { publications: publicationData, totalPublicationsByState },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();
  const { populationData } = usePopulationData();
  const totalPublications = publicationData.length;

  // add states with zero publications if they are selected
  const completePublicationsByState = useMemo(() => {
    return [
      ...selectedStates
        .filter(
          (state) =>
            !totalPublicationsByState.some((pub) => pub.state === state),
        )
        .map((state) => ({
          state: state,
          count: 0,
        })),
      ...totalPublicationsByState,
    ].map((pub) => {
      const popData = populationData.find((pop) => pop.state === pub.state);
      const perMillion = popData
        ? ((pub.count / popData.population) * 1000000).toFixed(2)
        : 0;
      return { ...pub, perMillion };
    });
  }, [selectedStates, totalPublicationsByState]);

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
        z:
          view === "totalPublications"
            ? completePublicationsByState.map((state) => state["count"])
            : completePublicationsByState.map((state) => state["perMillion"]),
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
        hovertemplate:
          view === "totalPublications"
            ? "%{location}: %{z} publications<extra></extra>"
            : "%{location}: %{z} publications per 1,000,000 people<extra></extra>",
      },
    ];
  }, [totalPublicationsByState, view]);

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
    hoverdistance: -1,
    margin: { r: 0, t: 0, b: 0, l: 0 },
  };

  return (
    <PlotWrapper>
      <CustomPlot
        data={plotData}
        layout={layout}
        style={{
          minHeight: 800,
        }}
      />
      <PlotCaption>
        This plot shows the number of publications under{" "}
        {customKeyword || topic} between the years of {yearRange[0]} and{" "}
        {yearRange[1]}. A total of {totalPublications} publications were
        retrieved.
      </PlotCaption>
      <ToggleViewButtons
        view={view}
        setView={setView}
        view1value="totalPublications"
        view2value="perMillion"
        view1text="Total publications"
        view2text="Per million people"
      />
    </PlotWrapper>
  );
};
