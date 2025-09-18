import { Avatar, Chip } from "@mui/material";
import { stateColorMapping, type States } from "../../constants/States";
import { useData } from "../../context/PublicationDataContext";

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
        fontSize: "0.75rem",
        "& .MuiChip-avatar": {
          width: "1rem",
          height: "1rem",
        },
        opacity: selected ? "100%" : "40%",
      }}
      size="small"
      label={state}
      onClick={handleClick}
      variant="outlined"
      avatar={<Avatar sx={{ bgcolor: stateColorMapping[state] }}> </Avatar>}
    />
  );
};
