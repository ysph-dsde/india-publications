import { Box, Typography } from "@mui/material";
import { CustomTabs } from "./shared/CustomTabs";

import { DataTable } from "./DataTable";
import { GeoPlot } from "./Plots/GeoPlot";
import { TemporalDistributionPlot } from "./Plots/TemporalDistributionPlot";
import { ConnectedDotPlot } from "./Plots/ConnectedDotPlot";
import { StackedBarPlot } from "./Plots/StackedBarPlot";
import { BubblePlot } from "./Plots/BubblePlot";
import { HdiProvider } from "../context/HdiContext";

export const MainContent = () => {
  const tabs = [
    {
      label: "Geographic Distribution of Publications",
      content: <GeoPlot />,
    },
    {
      label: "Temporal Distribution of Publications",
      content: <TemporalDistributionPlot />,
    },
    {
      label: "Publication vs Population",
      content: <ConnectedDotPlot />,
    },
    {
      label: "Stacked Bar Plot",
      content: <StackedBarPlot />,
    },
    {
      label: "HDI vs Publications",
      content: <BubblePlot />,
    },
  ];

  return (
    <Box>
      <CustomTabs tabs={tabs}></CustomTabs>
      <DataTable />
    </Box>
  );
};
