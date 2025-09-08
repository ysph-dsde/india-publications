import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useData } from "../../context/PublicationDataContext";
import { useEffect, useState } from "react";

export const Loading = () => {
  const {
    data: { loading },
    cancelSearch,
  } = useData();

  const loadingMessages = [
    "Searching the database...",
    "Reading publications...",
    "Processing your request...",
    "Parsing data...",
    "Loading content...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let messageInterval: NodeJS.Timeout;
    if (loading) {
      messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(messageInterval);
  }, [loading]);

  return (
    <Box
      sx={{
        backgroundColor: "rgba(219, 219, 219, 0.92)",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 2,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography>{loadingMessages[currentMessageIndex]}</Typography>
      <LinearProgress />
      <Button
        variant="contained"
        onClick={cancelSearch}
      >
        Cancel Search
      </Button>
    </Box>
  );
};
