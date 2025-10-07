import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { SelectionTitle } from "./SelectionTitle";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import {
  AuthorPositionsList,
  GrantTypesList,
  type AuthorPositions,
  type GrantTypes,
} from "../../constants/FilterTypes";
import TextField from "@mui/material/TextField";
import { useData } from "../../context/PublicationDataContext";
import {
  populationGroupMap,
  type PopulationGroup,
} from "../../constants/States";
import type { ChangeEvent } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { StatesSelector } from "./StatesSelector";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

export const Filter = () => {
  const { clientFilters, updateClientFilters } = useData();

  const handleMinCitationsChange = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Allow control keys: Backspace, Delete, ArrowLeft, ArrowRight, Tab
    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    // Allow digits 0-9 and control keys
    if (!/[0-9]/.test(event.key) && !allowedControlKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handlePopulationGroups =
    (group: PopulationGroup) => (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const newPopulationGroups = isChecked
        ? [...clientFilters.populationGroups, group]
        : clientFilters.populationGroups.filter((g) => g !== group);

      // Remove states from deselected group
      const statesToUpdate = populationGroupMap[group];
      const newStates = isChecked
        ? [...clientFilters.states, ...statesToUpdate]
        : clientFilters.states.filter(
            (state) => !statesToUpdate.includes(state),
          );

      updateClientFilters({
        populationGroups: newPopulationGroups,
        states: newStates,
      });
    };

  return (
    <Box>
      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{
          "::before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Filter</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List>
            <SelectionTitle
              title="Author position"
              toolTipText="Filter whether the author is first, first and last, or appears anywhere."
            />
            <ListItem>
              <Autocomplete
                autoComplete
                options={AuthorPositionsList}
                fullWidth
                value={clientFilters.authorPosition}
                disableClearable
                onChange={(_event, newValue: AuthorPositions) => {
                  updateClientFilters({ authorPosition: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Author position"
                  />
                )}
              />
            </ListItem>
            <SelectionTitle
              title="Minimum Citations"
              toolTipText="Only include publications with citations greater than or equal to this number"
            />
            <ListItem>
              <TextField
                fullWidth
                variant="standard"
                type="number"
                value={clientFilters.minimumCitations}
                onChange={(event) => {
                  const newValue = parseInt(event.target.value);
                  updateClientFilters({ minimumCitations: newValue });
                }}
                onBlur={() => {
                  if (
                    clientFilters.minimumCitations < 0 ||
                    clientFilters.minimumCitations == null ||
                    isNaN(clientFilters.minimumCitations)
                  )
                    updateClientFilters({ minimumCitations: 0 });
                }}
                onKeyDown={handleMinCitationsChange}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />
            </ListItem>
            <SelectionTitle
              title="States / Territories"
              toolTipText="Choose one or more states to filter publications."
            />
            <StatesSelector />
            <SelectionTitle
              title="Filter States / Territories By Share of National Population"
              toolTipText="Filter states by population group. High (>5% of national population), Medium (1-5%), Low (<1%)."
            />
            <ListItem sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={clientFilters.populationGroups.includes("high")}
                    onChange={handlePopulationGroups("high")}
                  />
                }
                label="High"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={clientFilters.populationGroups.includes("medium")}
                    onChange={handlePopulationGroups("medium")}
                  />
                }
                label="Medium"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={clientFilters.populationGroups.includes("low")}
                    onChange={handlePopulationGroups("low")}
                  />
                }
                label="Low"
              />
            </ListItem>
            <SelectionTitle
              title="Grant information accessible?"
              toolTipText="Filter publication by whether grant information is available."
            />
            <ListItem>
              <Autocomplete
                autoComplete
                options={GrantTypesList}
                fullWidth
                value={clientFilters.grantInformation}
                disableClearable
                onChange={(_event, newValue: GrantTypes) => {
                  updateClientFilters({ grantInformation: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Grant information"
                  />
                )}
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
