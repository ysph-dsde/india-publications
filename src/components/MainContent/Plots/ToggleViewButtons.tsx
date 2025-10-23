import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface ToggleViewButtonsProps {
  view: string;
  setView: Function;
  view1value: string;
  view2value: string;
  view1text: string;
  view2text: string;
}

export const ToggleViewButtons = ({
  view,
  setView,
  view1value,
  view2value,
  view1text,
  view2text,
}: ToggleViewButtonsProps) => {
  return (
    <ToggleButtonGroup
      className="hide-on-screenshot"
      sx={{ alignSelf: "center", pb: 2 }}
      value={view}
      exclusive
      onChange={(_e, newView) => newView && setView(newView)}
    >
      <ToggleButton value={view1value}>{view1text}</ToggleButton>
      <ToggleButton value={view2value}>{view2text}</ToggleButton>
    </ToggleButtonGroup>
  );
};
