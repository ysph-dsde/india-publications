import type React from "react";
import type { PlotParams } from "react-plotly.js";
import { baseConfig, createLayout } from "./plotConfig";
import { useEffect, useMemo, useState } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "../../customPlotly";
import Box from "@mui/material/Box";

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

  const [Plot, setPlot] = useState<ReturnType<
    typeof createPlotlyComponent
  > | null>(null);

  useEffect(() => {
    // Wait for PlotlyCore to be ready
    Promise.resolve(Plotly).then((plotlyInstance) => {
      const Plot = createPlotlyComponent(plotlyInstance);
      setPlot(() => Plot);
    });
  }, []);

  if (!Plot) {
    return <Box>Loading chart...</Box>;
  }

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
