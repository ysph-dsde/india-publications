import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { theme } from "../../Theme";

export const MobileNote = () => {
  return (
    <Paper sx={{ p: 2, bgcolor: theme.palette.primary.main, color: "white" }}>
      <Typography>
        Thank you for visiting IndiaPub. For the best experience and full
        functionality of the application, we recommend using a computer or
        tablet.
      </Typography>
    </Paper>
  );
};
