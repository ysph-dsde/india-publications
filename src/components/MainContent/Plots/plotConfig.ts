import { theme } from "../../../Theme";

// base layout with common settings
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
    title: {
      font: {
        size: 18,
        weight: "bold",
        color: theme.palette.secondary.main,
      },
    },
    tickfont: {
      size: 18,
    },
  },
  yaxis: {
    showgrid: false,
    title: {
      font: {
        size: 18,
        weight: "bold",
        color: theme.palette.secondary.main,
      },
    },
    tickfont: {
      size: 18,
    },
    automargin: true,
  },
  legend: {
    itemclick: false,
    itemdoubleclick: false,
    orientation: "h",
  },
  showlegend: false,
  font: {
    family: theme.typography.fontFamily,
  },
  title: {
    font: {
      size: 24,
      weight: "bold",
      color: theme.palette.secondary.main,
    },
  },
  margin: { t: 0, b: 70 },
};

// function to merge base layout with custom layout
export const createLayout = (
  customLayout: Partial<Plotly.Layout> = {},
): Partial<Plotly.Layout> => {
  return {
    ...baseLayout,
    ...customLayout,
    margin: {
      ...baseLayout.margin,
      ...customLayout.margin,
    },
    xaxis: {
      ...baseLayout.xaxis,
      ...customLayout.xaxis,
      title: {
        ...baseLayout.xaxis?.title,
        ...customLayout.xaxis?.title,
      },
    },
    yaxis: {
      ...baseLayout.yaxis,
      ...customLayout.yaxis,
      title: {
        ...baseLayout.yaxis?.title,
        ...customLayout.yaxis?.title,
      },
    },
    xaxis2: {
      ...baseLayout.xaxis,
      ...customLayout.xaxis2,
      title: {
        ...baseLayout.xaxis?.title,
        ...customLayout.xaxis2?.title,
      },
    },
    yaxis2: {
      ...baseLayout.yaxis,
      ...customLayout.yaxis2,
      title: {
        ...baseLayout.yaxis?.title,
        ...customLayout.yaxis2?.title,
      },
    },
    title: {
      ...baseLayout.title,
      ...customLayout.title,
    },
  };
};

// base configuration
export const baseConfig: Partial<Plotly.Config> = {
  responsive: true,
  displayModeBar: false,
  displaylogo: false,
  scrollZoom: false,
  doubleClick: false,
  modeBarButtonsToRemove: [
    "pan2d",
    "zoomIn2d",
    "zoomOut2d",
    "lasso2d",
    "select2d",
    "autoScale2d",
    "zoom2d",
    "resetScale2d",
    "zoomOutGeo",
    "zoomInGeo",
    "resetGeo",
    "zoomOut2d",
  ],
  toImageButtonOptions: {
    filename:
      "indiapub.org - Yale School of Public Health Data Science and Data Equity",
  },
};
