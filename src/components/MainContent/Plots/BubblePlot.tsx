import { useData } from "../../../context/PublicationDataContext";
import { stateColorMapping } from "../../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { useMemo } from "react";
import { Legend } from "./Legend";
import { theme } from "../../../Theme";
import { getHdiData } from "../../../utils/getHdiData";
import { Title } from "./Title";

export const BubblePlot = () => {
  const {
    data: { totalPublications: totalPublications, stateYearlyData },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();

  const hdiData = useMemo(() => getHdiData(), []);

  // Plotly notes:
  // To scale the bubble size, use the attribute sizeref with the following formula to calculate a sizeref value:
  // sizeref = 2.0 * Math.max(...size) / (desired_maximum_marker_size**2)
  // Note that setting 'sizeref' to a value greater than 1, decreases the rendered marker sizes, while setting 'sizeref' to less than 1, increases the rendered marker sizes. See https://plotly.com/python/reference/scatter/#scatter-marker-sizeref for more information.

  // get years for plotting order
  const yearCategories = Array.from(
    { length: yearRange[1] - yearRange[0] + 1 },
    (_, i) => (yearRange[0] + i).toString(),
  );

  // find max publications for use in relative scaling
  const globalMaxPublications = useMemo(() => {
    return stateYearlyData
      .filter((yd) => yd.year >= yearRange[0] && yd.year <= yearRange[1])
      .reduce((max, yd) => {
        const yearMax = selectedStates
          .map((state) => yd.states[state] || 0)
          .filter((count) => count > 0)
          .reduce((yearMax, count) => Math.max(yearMax, count), 0);
        return Math.max(max, yearMax);
      }, 1);
  }, [stateYearlyData, selectedStates, yearRange]);

  const desired_maximum_marker_size = 30;

  const traces: Plotly.Data[] = useMemo(() => {
    return selectedStates.map((state) => {
      const stateHdiPoints = hdiData && hdiData[state] ? hdiData[state] : [];

      // Filter HDI points within yearRange
      const filteredPoints = stateHdiPoints.filter(
        (point) => point.year >= yearRange[0] && point.year <= yearRange[1],
      );

      const years: number[] = [];
      const hdi: number[] = [];
      const sizes: number[] = [];
      const pubCounts: number[] = [];

      filteredPoints.forEach((point) => {
        const yearPubData = stateYearlyData.find(
          (yd) => yd.year === point.year,
        );
        const pubCount = yearPubData ? yearPubData.states[state] || 0 : 0;

        // exclude if there are no pubs (i.e. no "invisible points")
        if (pubCount > 0) {
          const scaledSize =
            2 *
            (pubCount / globalMaxPublications) *
            desired_maximum_marker_size ** 2;

          years.push(point.year);
          hdi.push(point.hdi);
          sizes.push(scaledSize);
          pubCounts.push(pubCount);
        }
      });

      // Return the trace for this state
      return {
        x: years,
        y: hdi,
        mode: "markers" as const,
        marker: {
          size: sizes,
          color: stateColorMapping[state] || theme.palette.gray.dark, // Fallback to gray if state not in mapping
          sizemode: "area",
        },
        name: state,
        type: "scatter" as const,
        text: pubCounts.map((num) => num.toString()),
        hovertemplate:
          // y is the HDI value; x is the year; text is publications
          "State: %{data.name}<br>" +
          "Year: %{x}<br>" +
          "HDI: %{y:.3f}<br>" +
          "Publications: %{text}<extra></extra>",
      };
    });
  }, [stateYearlyData, selectedStates, yearRange, globalMaxPublications, hdiData]);

  const layout: Partial<Plotly.Layout> = {
    xaxis: {
      title: {
        text: "Year",
      },
      type: "category",
      categoryarray: yearCategories,
    },
    yaxis: {
      title: {
        text: "Human Development Index (HDI)",
        standoff: 10,
      },
    },
    // border around plot
    shapes: [
      {
        type: "rect",
        xref: "paper",
        yref: "paper",
        x0: 0.01,
        y0: 0.01,
        x1: 1,
        y1: 1,
        line: {
          color: `${theme.palette.blue.main}`,
          width: 2,
        },
      },
    ],
    margin: { r: 10, l: 70 },
  };

  return (
    <PlotWrapper>
      <Title>Publications vs Human Development Index (HDI) Over Time</Title>
      <CustomPlot
        data={traces}
        layout={layout}
      />
      <Legend />
      <PlotCaption>
        This bubble plot displays the relationship between Human Development
        Index (HDI) and the number of publications under{" "}
        {customKeyword || topic} between {yearRange[0]} and {yearRange[1]}.
        Bubble size represents the number of publications. A total of{" "}
        {totalPublications} publications were retrieved.
      </PlotCaption>
    </PlotWrapper>
  );
};