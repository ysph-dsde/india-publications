import List from "@mui/material/List";
import { SelectionTitle } from "./SelectionTitle";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import {
  PublicationTopics,
  type PublicationTopic,
} from "../../constants/FilterTypes";
import { useData } from "../../context/PublicationDataContext";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { SectionTitle } from "./SectionTitle";
import { Loading } from "./Loading";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export const Search = () => {
  const { serverFilters, updateServerFilters } = useData();

  const [localCustomKeyword, setLocalCustomKeyword] = useState<string>(
    serverFilters.customKeyword,
  );
  const [localYearRange, setLocalYearRange] = useState<[number, number]>(
    serverFilters.yearRange,
  );
  const [localTopic, setLocalTopic] = useState<PublicationTopic>(
    serverFilters.topic,
  );

  const [showAnyTopicsWarning, setShowAnyTopicsWarning] = useState(false);

  useEffect(() => {
    setLocalYearRange(serverFilters.yearRange);
  }, [serverFilters.yearRange]);

  useEffect(() => {
    setLocalCustomKeyword(serverFilters.customKeyword);
  }, [serverFilters.customKeyword]);

  useEffect(() => {
    setLocalTopic(serverFilters.topic);
  }, [serverFilters.topic]);

  const performSearch = () => {
    updateServerFilters({
      yearRange: localYearRange,
      customKeyword: localCustomKeyword,
      topic: localTopic,
    });
  };

  const handleSearch = () => {
    if (
      localTopic === "Custom Keyword Search" &&
      localCustomKeyword.length === 0
    ) {
      return;
    }

    if (localTopic === "Any Topics") {
      setShowAnyTopicsWarning(true);
      return;
    }

    if (
      localYearRange[0] === serverFilters.yearRange[0] &&
      localYearRange[1] === serverFilters.yearRange[1] &&
      ((localTopic === serverFilters.topic &&
        localTopic !== "Custom Keyword Search") ||
        (localCustomKeyword === serverFilters.customKeyword &&
          localTopic === "Custom Keyword Search"))
    ) {
      return;
    }

    performSearch();
  };

  const handleConfirmAnyTopics = () => {
    setShowAnyTopicsWarning(false);
    performSearch();
  };

  return (
    <>
      <SectionTitle title="Search" />
      <List sx={{ pt: 0, position: "relative" }}>
        <Loading />
        <SelectionTitle
          title="Topic"
          toolTipText="Choose a predefined topic or use 'Custom Keyword Search' to input your own terms."
        />
        <ListItem>
          <Autocomplete
            autoComplete
            options={PublicationTopics}
            fullWidth
            value={localTopic}
            disableClearable
            onChange={(_event, newValue: PublicationTopic) => {
              setLocalCustomKeyword(
                newValue === "Custom Keyword Search"
                  ? serverFilters.customKeyword
                  : "",
              );
              setLocalTopic(newValue);
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
        {localTopic === "Custom Keyword Search" && (
          <SelectionTitle
            title="Keyword(s)"
            toolTip={false}
          />
        )}
        {localTopic === "Custom Keyword Search" && (
          <ListItem>
            <TextField
              fullWidth
              variant="standard"
              value={localCustomKeyword}
              onChange={(e) => {
                const newValue = e.target.value;
                setLocalCustomKeyword(newValue);
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
              value={localYearRange}
              onChange={(_event: Event, newValue: number[]) => {
                setLocalYearRange(newValue as [number, number]);
              }}
              valueLabelDisplay="auto"
              disableSwap
              min={2014}
              max={2025}
              marks={[
                { value: 2014, label: "2014" },
                { value: 2024, label: "2025" },
              ]}
            />
          </Box>
        </ListItem>
        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      </List>

      {/* Warning dialog for "Any Topics" searches */}
      <Dialog
        open={showAnyTopicsWarning}
        onClose={() => setShowAnyTopicsWarning(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          Any Topics search
        </DialogTitle>
        <DialogContent>
          <Typography align="center" sx={{ mt: 1 }}>
            To explore trends of India publications for any topics, this search
            may take a long time to load due to the large number of publications
            available.
          </Typography>
          <Typography align="center" sx={{ mt: 2 }}>
            Click <strong>Continue</strong> to proceed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleConfirmAnyTopics}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};