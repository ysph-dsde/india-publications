import { useData } from "../../context/PublicationDataContext";
import { theme } from "../../Theme";
import { stateColorMapping } from "../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { useMemo } from "react";
import { ToggleViewButtons } from "./ToggleViewButtons";
import { Legend } from "./Legend";

interface TemportalDistributionPlotProps {
  view: "national" | "byState";
  setView: Function;
}

export const TemporalDistributionPlot = ({
  view,
  setView,
}: TemportalDistributionPlotProps) => {
  const {
    data,
    serverFilters: { yearRange, topic, customKeyword },
    clientFilters: { states: selectedStates },
  } = useData();
  const { yearlyData, stateYearlyData } = data;

  const sortedStates = [...selectedStates].sort((a, b) => a.localeCompare(b));

  const nationalTrace: Plotly.Data[] = useMemo(() => {
    return [
      {
        x: yearlyData.map((item) => item.year),
        y: yearlyData.map((item) => item.count),
        mode: "lines+markers",
        marker: {
          color: `${theme.palette.blue.main}`,
          size: 14,
          symbol: "square",
        },
        line: {
          color: `${theme.palette.blue.main}`,
          width: 5,
        },
        hovertemplate: `Selected states <br>Year: %{x}<br>Publications: %{y}<extra></extra>`,
      },
    ];
  }, [yearlyData]);

  const statesTrace: Plotly.Data[] = useMemo(() => {
    return sortedStates.map((state) => ({
      x: stateYearlyData.map((item) => item.year),
      y: stateYearlyData.map((item) => item.states[state] || 0),
      mode: "lines+markers",
      name: state,
      marker: {
        color: stateColorMapping[state] || theme.palette.grey[500],
        size: 9,
        symbol: "square",
      },
      line: {
        color: stateColorMapping[state] || theme.palette.grey[500],
        width: 3,
      },
      hovertemplate: `State: ${state}<br>Year: %{x}<br>Publications: %{y}<extra></extra>`,
    }));
  }, [stateYearlyData, sortedStates]);

  const traces: Plotly.Data[] =
    view === "national" ? nationalTrace : statesTrace;

  const layout: Partial<Plotly.Layout> = {
    title: {
      text:
        view === "national"
          ? "Total Number of Publications Over Time"
          : "Publications Over Time by State",
    },
    yaxis: {
      title: {
        text: "Number of Publications",
      },
      showgrid: true,
      rangemode: "tozero",
    },
    xaxis: {
      title: {
        text: "Year",
      },
      type: "category",
    },
  };

  return (
    <PlotWrapper>
      <CustomPlot
        data={traces}
        layout={layout}
      />
      {view === "byState" && <Legend />}
      <PlotCaption>
        This line chart displays the trend in total publications under{" "}
        {customKeyword || topic} across selected states from {yearRange[0]} to{" "}
        {yearRange[1]}.
      </PlotCaption>
      <ToggleViewButtons
        view={view}
        setView={setView}
        view1value="national"
        view2value="byState"
        view1text="National"
        view2text="By State"
      />
    </PlotWrapper>
  );
};
