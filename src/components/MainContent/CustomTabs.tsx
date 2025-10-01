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
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        sx={{
          // display disabled scroll button on ends
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
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
          key={index}
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
        >
          {value === index && <Box sx={{ py: 3 }}>{tab.content}</Box>}
        </div>
      ))}
    </Box>
  );
});
