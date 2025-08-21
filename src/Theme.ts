import { createTheme } from "@mui/material/styles";

const yaleBlue = "#122340";

export const theme = createTheme({
  palette: {
    primary: {
      main: yaleBlue,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".js-plotly-plot .plotly [class*='cursor-']": {
          cursor: "default !important",
        },
      },
    },
  },
});
