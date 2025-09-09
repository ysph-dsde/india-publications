import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import React from "react";
import { useData } from "../../context/PublicationDataContext";

interface PlotWrapperProps {
  children: React.ReactNode;
}

const NoResults = () => {
  return (
    <Box
      p={2}
      textAlign="center"
    >
      <Typography variant="caption">
        No publications match selected filters.
      </Typography>
    </Box>
  );
};

export const PlotWrapper = ({ children }: PlotWrapperProps) => {
  const {
    clientFilters: { states: selectedStates },
    data: { publications, loading },
  } = useData();
  const totalPublications = publications.length;
  return (
    <Paper
      elevation={1}
      sx={{ display: "flex", flexDirection: "column", position: "relative" }}
    >
      {loading && (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
      )}
      {selectedStates.length === 0 || totalPublications === 0 ? (
        <NoResults />
      ) : (
        <>
          {loading && (
            <Box sx={{ width: "100%", zIndex: 2, px: 2, pt: 1 }}>
              <Typography>Loading data...</Typography>
              <LinearProgress />
            </Box>
          )}
          {children}
        </>
      )}
    </Paper>
  );
};
