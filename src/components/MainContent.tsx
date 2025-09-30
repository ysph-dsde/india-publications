import { CustomTabs } from "./shared/CustomTabs";

import { DataTable } from "./DataTable/DataTable";
import { GeoPlot } from "./Plots/GeoPlot";
import { TemporalDistributionPlot } from "./Plots/TemporalDistributionPlot";
import { ConnectedDotPlot } from "./Plots/ConnectedDotPlot";
import { StackedBarPlot } from "./Plots/StackedBarPlot";
import { BubblePlot } from "./Plots/BubblePlot";
import { useEffect, useState } from "react";
import { useData } from "../context/PublicationDataContext";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export const MainContent = () => {
  const { data, clearError } = useData();
  const [temporalDistributionView, setTemporalDistributionView] = useState<
    "national" | "byState"
  >("national");
  const [geoView, setGeoView] = useState<"totalPublications" | "perMillion">(
    "totalPublications",
  );
  const [stackedView, setStackedView] = useState<
    "yearRangeEnd" | "allPopulations"
  >("yearRangeEnd");
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
      label: "State and Union Territory Publication Percentage",
      content: (
        <StackedBarPlot
          view={stackedView}
          setView={setStackedView}
        />
      ),
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
