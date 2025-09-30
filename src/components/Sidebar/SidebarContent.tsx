import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { SelectionTitle } from "./SelectionTitle";
import {
  type PopulationGroup,
  populationGroupMap,
} from "../../constants/States";
import {
  PublicationTopics,
  AuthorPositionsList,
  GrantTypesList,
  type AuthorPositions,
  type GrantTypes,
} from "../../constants/FilterTypes";

import { StatesSelector } from "./StatesSelector";
import { useData } from "../../context/PublicationDataContext";
import ysphLogo from "../../assets/images/ysphLogoBlues.svg";
import { Loading } from "./Loading";
import { debounce } from "@mui/material/utils";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export const SidebarContent = () => {
  const {
    data: { loading },
    serverFilters,
    clientFilters,
    updateServerFilters,
    updateClientFilters,
  } = useData();

  // for visual change BEFORE API call
  const [localCustomKeyword, setLocalCustomKeyword] = useState<string>("");
  const [localYearRange, setLocalYearRange] = useState<[number, number]>(
    serverFilters.yearRange,
  );

  useEffect(() => {
    setLocalYearRange(serverFilters.yearRange);
  }, [serverFilters.yearRange]);

  useEffect(() => {
    setLocalCustomKeyword(serverFilters.customKeyword);
  }, [serverFilters.customKeyword]);

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

  // Persist debounced function across renders using useRef
  const debouncedUpdateCustomKeyword = useRef(
    debounce((value: string) => {
      updateServerFilters({ customKeyword: value.trim() }); // Trim to clean input
    }, 750),
  ).current;

  const debouncedUpdateYearRange = useRef(
    debounce((value: [number, number]) => {
      updateServerFilters({ yearRange: value });
    }, 750),
  ).current;

  return (
    <Box>
      <Toolbar>
        <Box
          component="img"
          src={ysphLogo}
          sx={{ maxWidth: "100%", height: "auto" }}
        />
      </Toolbar>
      <Divider />
      <Box sx={{ position: "relative" }}>
        {loading && <Loading />}
        <List sx={{ position: "relative", zIndex: 0 }}>
          <SelectionTitle
            title="Topic"
            toolTipText="Choose a predefined topic or use 'Custom Keyword Search' to input your own terms."
          />
          <ListItem>
            <Autocomplete
              autoComplete
              options={PublicationTopics}
              fullWidth
              value={serverFilters.topic}
              disableClearable
              onChange={(_event, newValue: string) => {
                updateServerFilters({
                  topic: newValue,
                  customKeyword:
                    newValue === "Custom Keyword Search"
                      ? serverFilters.customKeyword
                      : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Topic"
                />
              )}
            />
          </ListItem>
          {serverFilters.topic === "Custom Keyword Search" && (
            <SelectionTitle
              title="Keyword(s)"
              toolTip={false}
            />
          )}
          {serverFilters.topic === "Custom Keyword Search" && (
            <ListItem>
              <TextField
                fullWidth
                variant="standard"
                value={localCustomKeyword}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setLocalCustomKeyword(newValue); // Update local state immediately
                  debouncedUpdateCustomKeyword(newValue); // Update serverFilters after delay
                }}
                placeholder="Enter keywords"
              />
            </ListItem>
          )}
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
            title="Year range"
            toolTipText="Select the publication year range."
          />
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: "85%",
              }}
            >
              <Slider
                getAriaLabel={() => "Years range"}
                // value={serverFilters.yearRange}
                value={localYearRange}
                onChange={(_event: Event, newValue: number[]) => {
                  setLocalYearRange(newValue as [number, number]);
                  debouncedUpdateYearRange(newValue as [number, number]);

                  // updateServerFilters({
                  //   yearRange: newValue as [number, number],
                  // });
                }}
                valueLabelDisplay="auto"
                disableSwap
                min={2014}
                max={2024}
                marks={[
                  { value: 2014, label: "2014" },
                  { value: 2024, label: "2024" },
                ]}
              />
            </Box>
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
      </Box>
    </Box>
  );
};
