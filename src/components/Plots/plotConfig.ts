// Define base layout with common settings
const baseLayout: Partial<Plotly.Layout> = {
  autosize: true,
  dragmode: false,
  hovermode: "closest",
  hoverlabel: {
    bgcolor: "white",
  },
  xaxis: {
    showgrid: false,
    automargin: true,
  },
  yaxis: {
    showgrid: false,
  },
  legend: {
    itemclick: false,
    itemdoubleclick: false,
  },
};

// Utility function to merge base layout with custom layout
export const createLayout = (
  customLayout: Partial<Plotly.Layout> = {},
): Partial<Plotly.Layout> => {
  return {
    ...baseLayout,
    ...customLayout,
    xaxis: {
      ...baseLayout.xaxis,
      ...customLayout.xaxis,
    },
    yaxis: {
      ...baseLayout.yaxis,
      ...customLayout.yaxis,
    },
  };
};

export const baseConfig: Partial<Plotly.Config> = {
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
