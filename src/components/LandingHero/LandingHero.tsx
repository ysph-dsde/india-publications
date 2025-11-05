import Box from "@mui/material/Box";
import { TopNav } from "./TopNav";
import { Content } from "./Content";
import type { PublicationTopic } from "../../constants/FilterTypes";
import binary from "../../assets/images/binary.svg";

import AiIcon from "../../assets/images/topicIcons/ai.svg?react";
import COVID19Icon from "../../assets/images/topicIcons/COVID-19.svg?react";
import DevelopmentEconomicsIcon from "../../assets/images/topicIcons/developmentEconomics.svg?react";
import ElectronicHealthRecordsIcon from "../../assets/images/topicIcons/electronicHealthrecords.svg?react";
import EnvironmentalScienceIcon from "../../assets/images/topicIcons/environmentalScience.svg?react";
import GenomeWideAssociationsIcon from "../../assets/images/topicIcons/genome-wideAssociation.svg?react";

export interface ExploreOption {
  label: PublicationTopic;
  icon?: SvgrComponent;
}
const exploreOptions: ExploreOption[] = [
  { label: "Electronic Health Records", icon: ElectronicHealthRecordsIcon },
  {
    label: "Genome-Wide Association Studies",
    icon: GenomeWideAssociationsIcon,
  },
  { label: "Artificial Intelligence", icon: AiIcon },
  { label: "Development Economics", icon: DevelopmentEconomicsIcon },
  { label: "Environmental Science", icon: EnvironmentalScienceIcon },
  { label: "COVID-19", icon: COVID19Icon },
  { label: "Digital Health" },
  { label: "Game Theory" },
  { label: "International Trade" },
  { label: "Macroeconomics" },
  { label: "Public Finance" },
];

export const LandingHero = () => {
  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(to right, #000C8D, #790DA7)",
        position: "relative",
        color: "#fff",
        borderBottomLeftRadius: { xs: 25, sm: 50 },
        borderBottomRightRadius: { xs: 25, sm: 50 },

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
