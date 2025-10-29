import type React from "react";
import type { PlotParams } from "react-plotly.js";
import { baseConfig, createLayout } from "./plotConfig";
import { useMemo } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "../../../customPlotly";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "../../../Theme";

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

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const defaultStyle: React.CSSProperties = {
    width: "100%",
    minHeight: isMobile ? 400 : 600,
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
