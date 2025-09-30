// import PlotlyCore from "plotly.js/lib/core";

// Promise.all([
//   import("plotly.js/lib/bar"),
//   import("plotly.js/lib/scatter"),
//   import("plotly.js/lib/choropleth"),
// ]).then(([Bar, Scatter, Choropleth]) => {
//   PlotlyCore.register([Bar.default, Scatter.default, Choropleth.default]);
// });

// export default PlotlyCore;

import PlotlyCore from "plotly.js/lib/core";
import Bar from "plotly.js/lib/bar";
import Scatter from "plotly.js/lib/scatter";
import Choropleth from "plotly.js/lib/choropleth";

// Explicitly register all required modules
PlotlyCore.register([Bar, Scatter, Choropleth]);

export default PlotlyCore;