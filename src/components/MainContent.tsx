import {
  Alert,
  Box,
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { CustomTabs } from "./shared/CustomTabs";

import { DataTable } from "./DataTable";
import { GeoPlot } from "./Plots/GeoPlot";
import { TemporalDistributionPlot } from "./Plots/TemporalDistributionPlot";
import { ConnectedDotPlot } from "./Plots/ConnectedDotPlot";
import { StackedBarPlot } from "./Plots/StackedBarPlot";
import { BubblePlot } from "./Plots/BubblePlot";
import { useEffect, useState } from "react";
import { useData } from "../context/PublicationDataContext";

export const MainContent = () => {
  const { data, clearError } = useData();
  const [view, setView] = useState<"national" | "byState">("national");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data.error && data.error !== "Search cancelled") {
      setOpen(true);
    }
  }, [data.error]);

  const handleClose = () => {
    setOpen(false);
    clearError(); // Clear error when Snackbar closes
  };

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
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          An error occurred while loading data.
        </Alert>
      </Snackbar>
    </Box>
  );
};
