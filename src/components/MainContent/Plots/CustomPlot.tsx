import type React from "react";
import type { PlotParams } from "react-plotly.js";
import { baseConfig, createLayout } from "./plotConfig";
import { useMemo } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "../../../customPlotly";

const Plot = createPlotlyComponent(Plotly);

interface CustomPlotProps
  extends Omit<PlotParams, "layout" | "config" | "style" | "useResizeHandler"> {
  layout?: Partial<Plotly.Layout>;
  style?: React.CSSProperties;
}

export const CustomPlot = ({
  data,
  layout,
  style,
  ...rest
}: CustomPlotProps) => {
  const mergedLayout = useMemo(() => createLayout(layout), [layout]);

  const defaultStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 600,
    borderRadius: 4,
  };

  return (
    <Plot
      data={data}
      layout={mergedLayout}
      config={baseConfig}
      useResizeHandler
      {...rest}
      style={{ ...defaultStyle, ...style }}
    />
  );
};
