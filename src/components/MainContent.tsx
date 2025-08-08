import { Box, Typography } from "@mui/material";
import { CustomTabs } from "./shared/CustomTabs";

import { DataTable } from "./DataTable";

export const MainContent = () => {
  const tabs = [
    {
      label: "Geographic Distribution of Publications",
      content: (
        <Typography>
          Geographic Distribution of Publications Chart Coming Soon
        </Typography>
      ),
    },
    {
      label: "Temportal Distribution of Publications",
      content: (
        <Typography>
          Temportal Distribution of Publications Chart Coming Soon
        </Typography>
      ),
    },
    {
      label: "Publication vs Population",
      content: (
        <Typography>Publication vs Population Chart Coming Soon</Typography>
      ),
    },
    {
      label: "Stacked Bar Plot",
      content: <Typography>Stacked Bar Plot Chart Coming Soon</Typography>,
    },
    {
      label: "HDI vs Publications",
      content: <Typography>HDI vs Publications Chart Coming Soon</Typography>,
    },
  ];

  return (
    <Box>
      <CustomTabs tabs={tabs}></CustomTabs>
      <DataTable />
    </Box>
  );
};
