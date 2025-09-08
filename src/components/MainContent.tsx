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
  const [temporalDistributionView, setTemporalDistributionView] = useState<
    "national" | "byState"
  >("national");
  const [geoView, setGeoView] = useState<"totalPublications" | "perMillion">(
    "totalPublications",
  );
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (data.error && data.error !== "Search cancelled") {
      setErrorOpen(true);
    }
  }, [data.error]);

  const handleClose = () => {
    setErrorOpen(false);
    clearError(); // Clear error when Snackbar closes
  };

  const tabs = [
    {
      label: "Geographic Distribution of Publications",
      content: (
        <GeoPlot
          view={geoView}
          setView={setGeoView}
        />
      ),
    },
    {
      label: "Temporal Distribution of Publications",
      content: (
        <TemporalDistributionPlot
          view={temporalDistributionView}
          setView={setTemporalDistributionView}
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
      {data.loading && (
        <>
          <Typography>Loading data...</Typography>
          <LinearProgress />
        </>
      )}
      <>
        <CustomTabs tabs={tabs}></CustomTabs>
        <DataTable />
      </>
      <Snackbar
        open={errorOpen}
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
