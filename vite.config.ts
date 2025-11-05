import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({
      filename: "./dist/stats.html", // Output file for the visualizer
      open: true, // Automatically open the report in your browser after build
    }),
  ],
  define: {
    global: "globalThis",
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          plotly: [
            "plotly.js/lib/core",
            "plotly.js/lib/bar",
            "plotly.js/lib/scatter",
            "plotly.js/lib/choropleth",
          ],
          mui: ["@mui/material", "@mui/x-data-grid"],
          geojson: ["./src/assets/data/states_geo.json"],
        },
      },
    },
  },
});
