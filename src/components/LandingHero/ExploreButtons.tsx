import Button, { type ButtonProps } from "@mui/material/Button";
import { useState } from "react";
import { theme } from "../../Theme";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ExploreOption } from "./LandingHero";
import type { PublicationTopic } from "../../constants/FilterTypes";
import { useData } from "../../context/PublicationDataContext";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const CustomButton = ({ children, sx, ...restProps }: CustomButtonProps) => {
  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        bgcolor: "white",
        color: theme.palette.primary.main,
        borderRadius: 2,
        justifyContent: "left",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
        },
        textTransform: "capitalize",
        ...sx,
      }}
      {...restProps}
    >
      {children}
    </Button>
  );
};

interface ExploreButtonsListProps {
  exploreOptions: ExploreOption[];
}

export default function ExploreButtonsList({
  exploreOptions,
}: ExploreButtonsListProps) {
  const { updateServerFilters } = useData();

  const [expanded, setExpanded] = useState(false);

  const visibleCount = expanded ? exploreOptions.length : 6;
  const hiddenCount = exploreOptions.length - visibleCount;

  const handleOptionSelect = (selectedTopic: PublicationTopic) => {
    updateServerFilters({
      topic: selectedTopic,
    });
  };

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        minWidth: 325,
        gap: 2,
      }}
    >
      <Typography
        fontWeight="bold"
        variant="h5"
      >
        Explore the Data
      </Typography>

      {/* Explore buttons */}
      {exploreOptions
        .slice(0, visibleCount)
        .map((e: ExploreOption, index: number) => (
          <CustomButton
            onClick={() => handleOptionSelect(e.label)}
            key={index}
          >
            {e.label}
          </CustomButton>
        ))}

      {/* “+X more” button */}
      {!expanded && hiddenCount > 0 && (
        <CustomButton onClick={() => setExpanded(true)}>
          +{hiddenCount} more
        </CustomButton>
      )}

      {/* “show less” button */}
      {expanded && (
        <CustomButton onClick={() => setExpanded(false)}>
          show less
        </CustomButton>
      )}
    </Box>
  );
}
