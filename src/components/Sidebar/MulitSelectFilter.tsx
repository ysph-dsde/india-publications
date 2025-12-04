import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useState } from "react";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { Typography } from "@mui/material";

const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface MultiSelectFilterProps {
  // The current selected values from context
  value: string[];
  // Callback to update the filter in context
  onChange: (newValue: string[]) => void;
  // All available options (can be static or dynamic)
  options: string[];
  // Placeholder text for the input
  placeholder: string;
}

export const MultiSelectFilter = ({
  value,
  onChange,
  options,
  placeholder,
}: MultiSelectFilterProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const allSelected = value.length === options.length;

  const handleToggleAll = (event: any) => {
    event.preventDefault(); // Prevent any default behavior
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...options]);
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
          {allSelected ? "Deselect All" : "Select All"}
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
        options={options}
        fullWidth
        size="small"
        disableClearable
        clearOnBlur={false}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue, reason) => {
          if (reason === "input") setInputValue(newInputValue);
        }}
        limitTags={2}
        value={value.sort((a, b) => a.localeCompare(b))}
        onChange={(_event, newValue: string[]) => onChange(newValue)}
        slots={{ paper: CustomPaper }}
        // what options look like in dropdown
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
        // input field
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setInputValue("");
            }}
          />
        )}
        // a couple of selected options displayed
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
                {numTags > limitTags && (
                  <Typography sx={{ p: 0, m: 0, mr: 1 }}>
                    +{numTags - limitTags}
                  </Typography>
                )}
              </>
            );
          }
        }}
      />
    </ListItem>
  );
};
