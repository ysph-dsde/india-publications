import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/stats.html", // Output file for the visualizer
      open: true, // Automatically open the report in your browser after build
    }),
  ],
  define: {
    global: "globalThis",
  },
});
