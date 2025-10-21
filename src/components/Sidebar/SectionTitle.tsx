import ListItem from "@mui/material/ListItem";
import { theme } from "../../Theme";
import Typography from "@mui/material/Typography";

interface SectionTitleProps {
  title: string;
}

export const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <ListItem
      sx={{
        pt: "1rem",
        bgcolor: theme.palette.primary.main,
        borderTopRightRadius: { md: 20 },
        borderTopLeftRadius: { md: 20 },
      }}
    >
      <Typography
        sx={{ color: "white" }}
        fontWeight="bold"
      >
        {title}
      </Typography>
    </ListItem>
  );
};
