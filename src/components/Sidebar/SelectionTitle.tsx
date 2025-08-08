import {
  ClickAwayListener,
  IconButton,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";

interface SelectionTitleProps {
  title: string;
  toolTipText?: string;
  toolTip?: boolean;
}

const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (word) => {
    // Check if the word contains parentheses
    const match = word.match(/^(\w+)(?:\((.*)\))?$/);
    if (match) {
      const mainWord = match[1];
      const suffix = match[2] ? `(${match[2]})` : "";
      return (
        mainWord.charAt(0).toUpperCase() +
        mainWord.slice(1).toLowerCase() +
        suffix
      );
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
};

export const SelectionTitle = ({
  title,
  toolTipText,
  toolTip = true,
}: SelectionTitleProps) => {
  const formattedTitle = toTitleCase(title);

  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleTooltipToggle = () => {
    setTooltipOpen((prev) => !prev);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  return (
    <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography>{formattedTitle}</Typography>
      {toolTip && (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Tooltip
            title={toolTipText}
            open={tooltipOpen}
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <IconButton onClick={handleTooltipToggle}>
              <InfoIcon></InfoIcon>
            </IconButton>
          </Tooltip>
        </ClickAwayListener>
      )}
    </ListItem>
  );
};
