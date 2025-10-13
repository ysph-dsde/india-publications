import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "../../Theme";
import Button from "@mui/material/Button";
import siteSymbol from "../../assets/images/siteSymbol.svg";
import type { ExploreOption } from "./LandingHero";
import { useData } from "../../context/PublicationDataContext";
import type { PublicationTopic } from "../../constants/FilterTypes";

interface ContentProps {
  exploreOptions: ExploreOption[];
}

export const Content = ({ exploreOptions }: ContentProps) => {
  const { updateServerFilters } = useData();
  const handleOptionSelect = (selectedTopic: PublicationTopic) => {
    updateServerFilters({
      topic: selectedTopic,
    });
  };
  return (
    <Box
      sx={{
        px: { xs: "3%", xl: "15%" },
        py: "5%",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <Box
          component="img"
          src={siteSymbol}
          alt="Magnifying glass site symbol"
          width="50%"
        />
        <Typography
          variant="h3"
          color={theme.palette.blue.main}
        >
          A new lens on India's research ecosystem.
        </Typography>
      </Box>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          minWidth: 300,
          gap: 2,
        }}
      >
        <Typography
          color={theme.palette.gray.darkest}
          fontWeight="bold"
          variant="h5"
        >
          Explore the Data
        </Typography>
        {exploreOptions.map((item, id) => (
          <Button
            disableElevation
            sx={{
              bgcolor: theme.palette.gray.light,
              color: theme.palette.gray.darkest,
              borderRadius: 2,
            }}
            variant="contained"
            key={id}
            onClick={() => handleOptionSelect(item.label)}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
