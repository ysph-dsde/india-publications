import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
}

export const Title = ({ children }: TitleProps) => {
  return (
    <Box
      px={6}
      pt={2}
      display="flex"
      justifyContent="center"
    >
      <Typography
        color="secondary"
        fontWeight="bold"
        fontSize={24}
      >
        {children}
      </Typography>
    </Box>
  );
};
