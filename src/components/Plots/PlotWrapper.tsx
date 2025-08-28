import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { useData } from "../../context/PublicationDataContext";

interface PlotWrapperProps {
  children: React.ReactNode;
}

const NoStatesSelected = () => {
  return (
    <Box
      p={2}
      textAlign="center"
    >
      <Typography>Please select at least 1 state</Typography>
    </Box>
  );
};

export const PlotWrapper = ({ children }: PlotWrapperProps) => {
  const {
    data: { loading },
    clientFilters: { states: selectedStates },
  } = useData();
  return (
    <Paper
      elevation={1}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      {selectedStates.length === 0 ? (
        <NoStatesSelected />
      ) : (
        !loading && children
      )}
    </Paper>
  );
};
