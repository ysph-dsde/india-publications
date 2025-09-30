import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useData } from "../../context/PublicationDataContext";
import { useState } from "react";
import { getFilteredStates } from "../../utils/getFilteredStates";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const StatesSelector = () => {
  const { clientFilters, updateClientFilters } = useData();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleToggleAll = (event: any) => {
    event.preventDefault(); // Prevent any default behavior
    if (
      clientFilters.states.length === getFilteredStates(clientFilters).length
    ) {
      updateClientFilters({ states: [] });
    } else {
      updateClientFilters({ states: [...getFilteredStates(clientFilters)] });
    }
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
          {clientFilters.states.length ===
          getFilteredStates(clientFilters).length
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
        options={getFilteredStates(clientFilters)}
        fullWidth
        size="small"
        disableClearable
        clearOnBlur={false}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue, reason) => {
          if (reason === "input") setInputValue(newInputValue);
        }}
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
            onBlur={() => {
              setIsFocused(false);
              setInputValue("");
            }}
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
