import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import React, {
  useCallback,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import Paper from "@mui/material/Paper";
import { theme } from "../../Theme";

interface TabConfig {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabConfig[];
}

export const CustomTabs = React.memo(({ tabs }: TabsProps) => {
  const [value, setValue] = useState(0);

  const handleChange = useCallback(
    (_event: SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    [],
  );

  return (
    <Paper
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
      }}
      elevation={1}
      color="secondary"
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            bgcolor: theme.palette.secondary.light,
          },
          [`& .${tabsClasses.indicator}`]: {
            bgcolor: theme.palette.secondary.main,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            id={`simple-tab-${index}`}
            aria-controls={`simple-tabpanel-${index}`}
            sx={{
              fontSize: "1rem",
              "&.Mui-selected": {
                color: theme.palette.secondary.main,
                fontWeight: "bold",
              },
              textTransform: "none",
            }}
          />
        ))}
      </Tabs>
      <Divider />
      {tabs.map((tab, index) => (
        <Box
          key={index}
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
        >
          {value === index && <>{tab.content}</>}
        </Box>
      ))}
    </Paper>
  );
});
