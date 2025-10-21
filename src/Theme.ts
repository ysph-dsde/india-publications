import { createTheme } from "@mui/material/styles";

const yaleBlue = "#00356b";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000C8D",
    },
    secondary: {
      main: "#6E37A6",
      light: "#E5D8F2",
    },
    blue: {
      main: yaleBlue,
      medium: "#286dc0",
      light: "#63aaff",
    },
    gray: {
      darkest: "#222222",
      dark: "#4a4a4a",
      medium: "#978d85",
      light: "#dddddd",
      lightest: "#f9f9f9",
    },
    accent: {
      yellow: "#ffd55a",
      green: "#5f712d",
      orange: "#bd5319",
    },
  },
  typography: {
    fontFamily: [
      "Nunito Sans",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".js-plotly-plot .plotly [class*='cursor-']": {
          cursor: "default !important",
        },
        ".js-plotly-plot .plotly .legendtoggle": {
          cursor: "default !important",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    blue: {
      main: string;
      medium: string;
      light: string;
    };
    gray: {
      darkest: string;
      dark: string;
      medium: string;
      light: string;
      lightest: string;
    };
    accent: {
      yellow: string;
      green: string;
      orange: string;
    };
  }
  interface PaletteOptions {
    blue?: {
      main?: string;
      medium?: string;
      light?: string;
    };
    gray?: {
      darkest?: string;
      dark?: string;
      medium?: string;
      light?: string;
      lightest?: string;
    };
    accent?: {
      yellow?: string;
      green?: string;
      orange?: string;
    };
  }
}
