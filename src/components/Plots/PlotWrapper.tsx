import { Box, Paper, Skeleton, Typography } from "@mui/material";
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
      sx={{ display: "flex", flexDirection: "column" }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            gap: 0.5,
            width: "100%",
          }}
          px={2}
          pb={1}
        >
          <Skeleton
            variant="text"
            sx={{ fontSize: "2rem" }}
            width="25vw"
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={400}
          />
          <Typography
            alignSelf="flex-start"
            variant="caption"
            sx={{ width: 500 }}
          >
            {<Skeleton />}
          </Typography>
        </Box>
      ) : (
        <>
          {selectedStates.length === 0 || totalPublications === 0 ? (
            <NoResults />
          ) : (
            children
          )}
        </>
      )}
    </Paper>
  );
};
