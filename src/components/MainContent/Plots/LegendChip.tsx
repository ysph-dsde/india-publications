import { stateColorMapping, type States } from "../../../constants/States";
import { useData } from "../../../context/PublicationDataContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";

interface LegendChipProps {
  state: States;
}

export const LegendChip = ({ state }: LegendChipProps) => {
  const {
    clientFilters: { states: selectedStates },
  } = useData();

  const selected = selectedStates.includes(state);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 0.5,
        opacity: selected ? "100%" : "40%",
      }}
    >
      <CircleIcon sx={{ fill: stateColorMapping[state] }} />
      <Typography fontSize="1.11rem">{state}</Typography>
    </Box>
  );
};
