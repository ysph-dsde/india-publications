import Button, { type ButtonProps } from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { theme } from "../../Theme";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ExploreOption } from "./LandingHero";
import type { PublicationTopic } from "../../constants/FilterTypes";
import { useData } from "../../context/PublicationDataContext";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SvgIcon from "@mui/material/SvgIcon";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";

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

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const dropdownSelected = (selectedTopic: PublicationTopic) => {
    handleToggle();
    handleOptionSelect(selectedTopic);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

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
            startIcon={
              <>
                {e.icon && (
                  <SvgIcon
                    component={e.icon}
                    inheritViewBox
                    sx={{ fontSize: 20 }} // MUI sx works here!
                  />
                )}
              </>
            }
          >
            {e.label}
          </CustomButton>
        ))}

      {/* Other options dropdown */}
      <CustomButton
        ref={anchorRef}
        onClick={handleToggle}
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
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        sx={{
          zIndex: 1300,
        }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                borderRadius: 2,
                width: anchorRef ? anchorRef.current?.offsetWidth : undefined,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  onKeyDown={handleListKeyDown}
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
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
