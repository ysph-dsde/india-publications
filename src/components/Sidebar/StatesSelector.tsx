import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  Divider,
  ListItem,
  Paper,
  TextField,
  type PaperProps,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useData } from "../../context/PublicationDataContext";
import {
  population_states_high,
  population_states_low,
  population_states_medium,
} from "../../constants/States";
import { useState } from "react";

const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const StatesSelector = () => {
  const { clientFilters, updateClientFilters } = useData();
  const [isFocused, setIsFocused] = useState(false);

  const handleToggleAll = (event: any) => {
    event.preventDefault(); // Prevent any default behavior
    if (clientFilters.states.length === getFilteredStates().length) {
      updateClientFilters({ states: [] });
    } else {
      updateClientFilters({ states: [...getFilteredStates()] });
    }
  };

  const getFilteredStates = () => {
    const selected: string[] = [];
    if (clientFilters.populationGroups.includes("high"))
      selected.push(...population_states_high);
    if (clientFilters.populationGroups.includes("medium"))
      selected.push(...population_states_medium);
    if (clientFilters.populationGroups.includes("low"))
      selected.push(...population_states_low);
    return selected.sort((a, b) => a.localeCompare(b));
  };

  // Custom Paper component to include the select/deselect all button
  const CustomPaper = (props: PaperProps) => {
    return (
      <Paper {...props}>
        <Button
          onMouseDown={(e) => e.preventDefault()}
          variant="text"
          onClick={handleToggleAll}
          fullWidth
        >
          {clientFilters.states.length === getFilteredStates().length
            ? "Deselect All"
            : "Select All"}
        </Button>
        <Divider />
        {props.children}
      </Paper>
    );
  };

  return (
    <ListItem>
      <Autocomplete
        multiple
        autoComplete
        disableCloseOnSelect
        options={getFilteredStates()}
        fullWidth
        size="small"
        disableClearable
        limitTags={2}
        value={clientFilters.states.sort((a, b) => a.localeCompare(b))}
        onChange={(_event, newValue: string[]) => {
          updateClientFilters({ states: newValue });
        }}
        slots={{ paper: CustomPaper }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li
              key={key}
              {...optionProps}
            >
              <Checkbox
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="States"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
        renderValue={(value: readonly string[], getItemProps) => {
          if (!isFocused) {
            const numTags = value.length;
            const limitTags = 2;
            return (
              <>
                {value.slice(0, limitTags).map((option, index) => (
                  <Chip
                    size="small"
                    {...getItemProps({ index })}
                    key={index}
                    label={option}
                    onDelete={undefined}
                  />
                ))}
                {numTags > limitTags && `+${numTags - limitTags} `}
              </>
            );
          }
        }}
      />
    </ListItem>
  );
};
