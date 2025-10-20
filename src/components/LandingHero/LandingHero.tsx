import Box from "@mui/material/Box";
import { theme } from "../../Theme";
import { TopNav } from "./TopNav";
import { Content } from "./Content";
import type { PublicationTopic } from "../../constants/FilterTypes";

export interface ExploreOption {
  label: PublicationTopic;
}
const exploreOptions: ExploreOption[] = [
  { label: "Electronic Health Records" },
  { label: "Artificial Intelligence" },
  { label: "COVID-19" },
  { label: "International Trade" },
  { label: "Digital Health" },
];

export const LandingHero = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme.palette.gray.lightest,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
      }}
    >
      <TopNav exploreOptions={exploreOptions} />
      <Content exploreOptions={exploreOptions} />
    </Box>
  );
};
