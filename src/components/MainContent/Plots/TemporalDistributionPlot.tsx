import { useData } from "../../../context/PublicationDataContext";
import { theme } from "../../../Theme";
import { stateColorMapping } from "../../../constants/States";
import { PlotWrapper } from "./PlotWrapper";
import { PlotCaption } from "./PlotCaption";
import { CustomPlot } from "./CustomPlot";
import { useMemo } from "react";
import { ToggleViewButtons } from "./ToggleViewButtons";
import { Legend } from "./Legend";
import { Title } from "./Title";

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
    return selectedStates.map((state) => ({
      x: stateYearlyData.map((item) => item.year),
      y: stateYearlyData.map((item) => item.states[state] || 0),
      mode: "lines+markers",
      name: state,
      marker: {
        color: stateColorMapping[state] || theme.palette.gray.dark,
        size: 9,
        symbol: "square",
      },
      line: {
        color: stateColorMapping[state] || theme.palette.gray.dark,
        width: 3,
      },
      hovertemplate: `State: ${state}<br>Year: %{x}<br>Publications: %{y}<extra></extra>`,
    }));
  }, [stateYearlyData, selectedStates]);

  const traces: Plotly.Data[] =
    view === "national" ? nationalTrace : statesTrace;

  // calculate bounds for y-axis
  const calcBounds = (): {
    lowerBound: number;
    upperBound: number;
    dtick: number;
  } => {
    let overallMax = -Infinity; // Initialize with negative infinity to ensure any value is greater
    let overallMin = Infinity; // Initialize with positive infinity to ensure any value is less

    traces.forEach((trace) => {
      // Check if the trace has a 'y' property -- it will! (to account for Typescript Type)
      if ("y" in trace && Array.isArray(trace.y)) {
        const yValues = trace.y as number[];
        if (yValues.length > 0) {
          const traceMax = Math.max(...yValues.filter((val) => !isNaN(val)));
          const traceMin = Math.min(...yValues.filter((val) => !isNaN(val)));
          overallMax = Math.max(overallMax, traceMax);
          overallMin = Math.min(overallMin, traceMin);
        }
      }
    });

    // Handle edge case where min and max are equal
    if (overallMin === overallMax) {
      const offset = overallMin === 0 ? 1 : overallMin;
      overallMin = 0;
      overallMax = overallMin + offset;
    }

    const maxTicks = 7;
    const range = overallMax - overallMin;
    const roughDtick = range / (maxTicks - 1);
    const exponent = Math.floor(Math.log10(Math.abs(roughDtick)));
    const fraction = roughDtick / Math.pow(10, exponent);

    // Choose a nice tick interval (1, 2, 5, or 10 scaled by 10^exponent)
    let niceFraction: number;
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;

    const dtick = niceFraction * Math.pow(10, exponent);
    const lowerBound = Math.floor(overallMin / dtick) * dtick - 1;
    const upperBound = Math.ceil(overallMax / dtick) * dtick * 1.1;

    return { lowerBound, upperBound, dtick };
  };

  const yAxisBounds = calcBounds();

  const layout: Partial<Plotly.Layout> = {
    yaxis: {
      title: {
        text: "Number of Publications",
      },
      showgrid: true,
      range: [yAxisBounds.lowerBound, yAxisBounds.upperBound],
      dtick: yAxisBounds.dtick,
    },
    xaxis: {
      title: {
        text: "Year",
      },
      type: "category",
    },
    margin: { r: 20, l: 70 },
  };

  return (
    <PlotWrapper>
      <Title>
        {view === "national"
          ? "Total Number of Publications Over Time"
          : "Publications Over Time by State and Union Territory"}
      </Title>
      <CustomPlot
        data={traces}
        layout={layout}
      />
      {view === "byState" && <Legend />}
      <PlotCaption>
        This line chart displays the trend in total publications under{" "}
        {customKeyword || topic} across selected states / territories from{" "}
        {yearRange[0]} to {yearRange[1]}.
      </PlotCaption>
      <ToggleViewButtons
        view={view}
        setView={setView}
        view1value="national"
        view2value="byState"
        view1text="National"
        view2text="By State and Union Territory"
      />
    </PlotWrapper>
  );
};
