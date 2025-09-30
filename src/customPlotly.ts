import PlotlyCore from "plotly.js/lib/core";

Promise.all([
  import("plotly.js/lib/bar"),
  import("plotly.js/lib/scatter"),
  import("plotly.js/lib/choropleth"),
]).then(([Bar, Scatter, Choropleth]) => {
  PlotlyCore.register([Bar.default, Scatter.default, Choropleth.default]);
});

export default PlotlyCore;
