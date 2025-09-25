// components/shared/Tabs.tsx

import { Box, Tab, Tabs, Divider, tabsClasses } from "@mui/material";
import { useState, type ReactNode, type SyntheticEvent } from "react";

interface TabConfig {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabConfig[];
}

export const CustomTabs = ({ tabs }: TabsProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.label}
            label={tab.label}
            id={`simple-tab-${index}`}
            aria-controls={`simple-tabpanel-${index}`}
            sx={{ fontSize: "1rem" }}
          />
        ))}
      </Tabs>
      <Divider />
      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
        >
          {value === index && <Box sx={{ pb: 3, pt: 3 }}>{tab.content}</Box>}
        </div>
      ))}
    </Box>
  );
};
