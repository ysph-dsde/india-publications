import Box from "@mui/material/Box";
import { TopNav } from "./TopNav";
import { Content } from "./Content";
import type { PublicationTopic } from "../../constants/FilterTypes";
import binary from "../../assets/images/binary.svg";

export interface ExploreOption {
  label: PublicationTopic;
}
const exploreOptions: ExploreOption[] = [
  { label: "Electronic Health Records" },
  { label: "Genome-Wide Association Studies" },
  { label: "Artificial Intelligence" },
  { label: "Development Economics" },
  { label: "Environmental Science" },
  { label: "COVID-19" },
];

export const LandingHero = () => {
  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(to right, #000C8D, #790DA7)",
        position: "relative",
        color: "#fff",
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,

        // Semi-transparent image
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(${binary}) center/cover no-repeat`,

          // Opacity gradient
          maskImage: "linear-gradient(to right, transparent 10%, black 100%)",
          maskSize: "100% 100%",
          maskRepeat: "no-repeat",

          // Base opacity (max opacity on the right)
          opacity: 0.2,
        },

        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <TopNav exploreOptions={exploreOptions} />
      <Content exploreOptions={exploreOptions} />
    </Box>
  );
};
