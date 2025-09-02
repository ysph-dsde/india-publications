import { useHdiData } from "../../context/HdiContext";
import { useData } from "../../context/PublicationDataContext";
import { stateColorMapping } from "../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { useMemo } from "react";

export const BubblePlot = () => {
  const {
    data: { publications: publicationData, stateYearlyData },
    clientFilters: { states: selectedStates },
    serverFilters: { yearRange, topic, customKeyword },
  } = useData();
  const { hdiData } = useHdiData();
  const totalPublications = publicationData.length;

  // To scale the bubble size, use the attribute sizeref with the following formula to calculate a sizeref value:
  // sizeref = 2.0 * Math.max(...size) / (desired_maximum_marker_size**2)
  // Note that setting 'sizeref' to a value greater than 1, decreases the rendered marker sizes, while setting 'sizeref' to less than 1, increases the rendered marker sizes. See https://plotly.com/python/reference/scatter/#scatter-marker-sizeref for more information.

  // sort states alphabetically
  const sortedStates = [...selectedStates].sort((a, b) => a.localeCompare(b));

  // get years for plotting order
  const yearCategories = Array.from(
    { length: yearRange[1] - yearRange[0] + 1 },
    (_, i) => (yearRange[0] + i).toString(),
  );

  // find max size for publications to scale all bubbles relative to this
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

  const desired_maximum_marker_size = 25;

  const traces: Plotly.Data[] = useMemo(() => {
    return sortedStates.map((state) => {
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
          color: stateColorMapping[state] || "#333333", // Fallback to black if state not in mapping
          sizemode: "area",
        },
        name: state,
        type: "scatter" as const,
        text: pubCounts.map((num) => num.toString()),
        hovertemplate:
          "State: %{data.name}, Publications: %{text}<extra></extra>",
      };
    });
  }, [stateYearlyData, sortedStates, yearRange, globalMaxPublications]);

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: "Publications vs Human Development Index (HDI) Over Time",
    },
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
      },
    },
  };

  return (
    <PlotWrapper>
      <CustomPlot
        data={traces}
        layout={layout}
      />
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
