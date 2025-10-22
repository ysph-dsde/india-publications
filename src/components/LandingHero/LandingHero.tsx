import Box from "@mui/material/Box";
import { TopNav } from "./TopNav";
import { Content } from "./Content";
import type { PublicationTopic } from "../../constants/FilterTypes";

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
        color: "#fff",
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
      }}
    >
      <TopNav exploreOptions={exploreOptions} />
      <Content exploreOptions={exploreOptions} />
    </Box>
  );
};
