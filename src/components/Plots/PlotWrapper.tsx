import { Paper } from "@mui/material";
import React from "react";

interface PlotWrapperProps {
  children: React.ReactNode;
  show: boolean;
}

export const PlotWrapper = ({ children, show }: PlotWrapperProps) => {
  return <Paper elevation={1}>{show && children}</Paper>;
};
