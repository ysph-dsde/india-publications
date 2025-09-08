import { Box, Paper, Typography } from "@mui/material";
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
    data: { publications },
  } = useData();
  const totalPublications = publications.length;
  return (
    <Paper
      elevation={1}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      {selectedStates.length === 0 || totalPublications === 0 ? (
        <NoResults />
      ) : (
        children
      )}
    </Paper>
  );
};
