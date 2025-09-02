import { Box, LinearProgress, Typography } from "@mui/material";
import { CustomTabs } from "./shared/CustomTabs";

import { DataTable } from "./DataTable";
import { GeoPlot } from "./Plots/GeoPlot";
import { TemporalDistributionPlot } from "./Plots/TemporalDistributionPlot";
import { ConnectedDotPlot } from "./Plots/ConnectedDotPlot";
import { StackedBarPlot } from "./Plots/StackedBarPlot";
import { BubblePlot } from "./Plots/BubblePlot";
import { useState } from "react";
import { useData } from "../context/PublicationDataContext";

export const MainContent = () => {
  const { data } = useData();
  const [view, setView] = useState<"national" | "byState">("national");

  const tabs = [
    {
      label: "Geographic Distribution of Publications",
      content: <GeoPlot />,
    },
    {
      label: "Temporal Distribution of Publications",
      content: (
        <TemporalDistributionPlot
          view={view}
          setView={setView}
        />
      ),
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
      {data.loading ? (
        <>
          <Typography>Loading data...</Typography>
          <LinearProgress />
        </>
      ) : (
        <>
          <CustomTabs tabs={tabs}></CustomTabs>
          <DataTable />
        </>
      )}
    </Box>
  );
};
