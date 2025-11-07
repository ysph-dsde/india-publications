import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import indiapubIcon from "../../assets/images/indiapubIconWhite.svg";
import type { ExploreOption } from "./LandingHero";
import ExploreButtonsList from "./ExploreButtons";

interface ContentProps {
  exploreOptions: ExploreOption[];
}

export const Content = ({ exploreOptions }: ContentProps) => {
  return (
    <Box
      sx={{
        px: { xs: "7%", md: "3%" },
        py: { xs: "7%", md: "5%" },
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
          gap: 7,
          justifyContent: "flex-end",
        }}
      >
        <Box
          component="img"
          src={indiapubIcon}
          color="white"
          alt="Magnifying glass site symbol"
          width="25%"
          sx={{
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />
        <Typography
          variant="h3"
          fontWeight="medium"
          lineHeight={1}
        >
          A new lens on India's published research output.
        </Typography>
      </Box>
      <ExploreButtonsList exploreOptions={exploreOptions} />
    </Box>
  );
};
