import Button, { type ButtonProps } from "@mui/material/Button";
import { useState } from "react";
import { theme } from "../../Theme";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ExploreOption } from "./LandingHero";
import type { PublicationTopic } from "../../constants/FilterTypes";
import { useData } from "../../context/PublicationDataContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: theme.palette.secondary.light,
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

  const visibleCount = Math.min(6, exploreOptions.length);

  const handleOptionSelect = (selectedTopic: PublicationTopic) => {
    updateServerFilters({
      topic: selectedTopic,
    });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dropdownSelected = (selectedTopic: PublicationTopic) => {
    handleClose();
    handleOptionSelect(selectedTopic);
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

      {/* Other options dropdown */}
      <CustomButton
        onClick={handleClick}
        sx={{ justifyContent: "space-between" }}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              transition: "transform 0.2s ease-in-out",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        }
      >
        See more datasets
      </CustomButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            sx: {
              width: anchorEl ? anchorEl.offsetWidth : undefined,
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {exploreOptions
          .slice(visibleCount, exploreOptions.length)
          .map((e: ExploreOption, index: number) => (
            <MenuItem
              sx={{
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.secondary.light,
                },
              }}
              onClick={() => dropdownSelected(e.label)}
              key={index}
            >
              {e.label}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}
