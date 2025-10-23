import React, { useRef } from "react";
import { useData } from "../../../context/PublicationDataContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { toPng } from "html-to-image";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

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
    if (!contentRef.current) return;

    // Clone the node
    const clone = contentRef.current.cloneNode(true) as HTMLElement;

    // Create a temporary container
    const container = document.createElement("div");
    container.style.width = contentRef.current.offsetWidth + "px";
    document.body.appendChild(container);
    container.appendChild(clone);

    // Find watermark element(s)
    const watermarks = clone.querySelectorAll(".watermark");
    // Find elements to hide
    const toHide = clone.querySelectorAll(".hide-on-screenshot");

    // Set watermark display
    watermarks.forEach((e) => {
      (e as HTMLElement).style.display = "flex";
    });

    // Set elements to hide
    toHide.forEach((e) => {
      (e as HTMLElement).style.display = "none";
    });

    try {
      // Convert to PNG
      const dataUrl = await toPng(container, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "white",
      });

      // Trigger download
      const link = document.createElement("a");
      link.download = "chart-with-watermark.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      // Cleanup
      document.body.removeChild(container);
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
          <div
            className="watermark"
            style={{
              top: 16,
              right: 16,
              display: "none",
              fontSize: 36,
              pointerEvents: "none",
            }}
          >
            WATERMARK
          </div>
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
