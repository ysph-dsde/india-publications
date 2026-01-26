import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type React from "react";

interface PlotCaptionProps {
  children: React.ReactNode;
}

export const PlotCaption = ({ children }: PlotCaptionProps) => {
  return (
    <Box
      px={2}
      pb={2}
    >
      <Typography
        variant="caption"
        fontSize={18}
      >
        <b>Note:</b> {children}
      </Typography>
    </Box>
  );
};
