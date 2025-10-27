import Button, { type ButtonProps } from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import type { ReactNode } from "react";

interface DownloadButtonProps extends ButtonProps {
  children: ReactNode;
}

export const DownloadButton = ({ children, ...props }: DownloadButtonProps) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      endIcon={<FileDownloadIcon fontSize="small" />}
      sx={{
        borderRadius: 5,
        fontWeight: "bold",
        px: 3,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
