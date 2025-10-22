import React, { useRef } from "react";
import { useData } from "../../../context/PublicationDataContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import domtoimage from "dom-to-image";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import "./styles.css";

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

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (contentRef.current) {
      try {
        // Convert the DOM element to a PNG blob
        const dataUrl = await domtoimage.toPng(contentRef.current, {
          quality: 1, // Maximum quality
          bgcolor: "#ffffff", // White background for the image
        });

        // Create a temporary link to trigger download
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "graph-snapshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        position: "relative",
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
      }}
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
        <Box
          ref={contentRef}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          {loading && (
            <Box sx={{ width: "100%", zIndex: 2, px: 2, pt: 1 }}>
              <Typography>Loading data...</Typography>
              <LinearProgress />
            </Box>
          )}
          {children}
        </Box>
      )}
      <Box
        display="flex"
        justifyContent="center"
        pb={2}
      >
        <Button
          sx={{ width: 190 }}
          variant="contained"
          color="secondary"
          onClick={handleDownload}
          size="small"
          endIcon={<FileDownloadIcon fontSize="small" />}
        >
          Download plot
        </Button>
      </Box>
    </Paper>
  );
};
