import Chip from "@mui/material/Chip";
import { stateColorMapping, type States } from "../../../constants/States";
import { useData } from "../../../context/PublicationDataContext";
import Avatar from "@mui/material/Avatar";

interface LegendChipProps {
  state: States;
}

export const LegendChip = ({ state }: LegendChipProps) => {
  const {
    clientFilters: { states: selectedStates },
    updateClientFilters,
  } = useData();
  const handleClick = () => {
    const updatedStates = selectedStates.includes(state)
      ? selectedStates.filter((id) => id !== state) // Remove state
      : [...selectedStates, state]; // Add state

    updateClientFilters({ states: updatedStates });
  };

  const selected = selectedStates.includes(state);

  return (
    <Chip
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        border: "none",
        fontSize: "1.25rem",
        "& .MuiChip-avatar": {
          width: "1.5rem",
          height: "1.5rem",
        },
        opacity: selected ? "100%" : "40%",
        py: 2,
      }}
      size="small"
      label={state}
      onClick={handleClick}
      variant="outlined"
      avatar={<Avatar sx={{ bgcolor: stateColorMapping[state] }}> </Avatar>}
    />
  );
};
