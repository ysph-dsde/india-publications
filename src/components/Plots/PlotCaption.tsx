import { Box, Typography } from "@mui/material";
import type React from "react";

interface PlotCaptionProps {
  children: React.ReactNode;
}

export const PlotCaption = ({ children }: PlotCaptionProps) => {
  return (
    <Box
      px={2}
      pb={1}
    >
      <Typography variant="caption">{children}</Typography>
    </Box>
  );
};
