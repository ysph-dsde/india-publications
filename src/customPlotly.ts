import PlotlyCore from "plotly.js/lib/core";
import Bar from "plotly.js/lib/bar";
import Scatter from "plotly.js/lib/scatter";
import Choropleth from "plotly.js/lib/choropleth";

// Explicitly register all required modules
PlotlyCore.register([Bar, Scatter, Choropleth]);

export default PlotlyCore;