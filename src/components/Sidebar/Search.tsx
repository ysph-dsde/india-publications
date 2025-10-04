import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import { SelectionTitle } from "./SelectionTitle";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import { PublicationTopics } from "../../constants/FilterTypes";
import { useData } from "../../context/PublicationDataContext";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
// import { debounce } from "@mui/material/utils";

export const Search = () => {
  const { serverFilters, updateServerFilters } = useData();

  // for visual change BEFORE API call
  const [localCustomKeyword, setLocalCustomKeyword] = useState<string>(
    serverFilters.customKeyword,
  );
  const [localYearRange, setLocalYearRange] = useState<[number, number]>(
    serverFilters.yearRange,
  );

  //
  //
  //
  // TODO need to make this type safe
  const [localTopic, setLocalTopic] = useState<string>(serverFilters.topic);

  useEffect(() => {
    setLocalYearRange(serverFilters.yearRange);
  }, [serverFilters.yearRange]);

  useEffect(() => {
    setLocalCustomKeyword(serverFilters.customKeyword);
  }, [serverFilters.customKeyword]);

  useEffect(() => {
    setLocalTopic(serverFilters.topic);
  }, [serverFilters.topic]);

  // // Persist debounced function across renders using useRef
  // const debouncedUpdateCustomKeyword = useRef(
  //   debounce((value: string) => {
  //     updateServerFilters({ customKeyword: value.trim() }); // Trim to clean input
  //   }, 750),
  // ).current;

  // const debouncedUpdateYearRange = useRef(
  //   debounce((value: [number, number]) => {
  //     updateServerFilters({ yearRange: value });
  //   }, 750),
  // ).current;

  return (
    <Accordion
      defaultExpanded
      elevation={0}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span">Search</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List>
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
                  // debouncedUpdateCustomKeyword(newValue); // Update serverFilters after delay
                }}
                placeholder="Enter keywords"
              />
            </ListItem>
          )}
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
                  // debouncedUpdateYearRange(newValue as [number, number]);

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
          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={() =>
                updateServerFilters({
                  yearRange: localYearRange,
                  customKeyword: localCustomKeyword,
                  topic: localTopic,
                })
              }
            >
              Search
            </Button>
          </Box>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
