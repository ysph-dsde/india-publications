import { Box, Button, Link, Tooltip } from "@mui/material";
import {
  DataGrid,
  ExportCsv,
  Toolbar,
  ToolbarButton,
  type GridColDef,
} from "@mui/x-data-grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { useData } from "../../context/PublicationDataContext";
import { ToolbarSearch } from "./ToolbarSearch";

const CustomToolbar = () => {
  return (
    <Toolbar>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <ExportCsv
          options={{
            allColumns: true, // Export all columns
            fileName: "publications_data", // Custom file name
          }}
          render={
            <Tooltip title={"Download all"}>
              <ToolbarButton
                render={
                  <Button
                    variant="text"
                    sx={{
                      color: "#707070",
                    }}
                    size="small"
                    endIcon={<FileDownloadIcon fontSize="small" />}
                  >
                    Download all data
                  </Button>
                }
              />
            </Tooltip>
          }
        />
        <ToolbarSearch />
      </Box>
    </Toolbar>
  );
};

export const DataTable = () => {
  const { data } = useData();

  const columns: GridColDef[] = [
    {
      field: "publication_year",
      headerName: "Year",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params: any) => {
        const doi = params?.row?.doi;
        const title = params?.row?.title;

        return (
          <Link
            href={doi}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </Link>
        );
      },
    },
    {
      field: "cited_by_count",
      headerName: "Citations",
      flex: 1,
    },
    {
      field: "author_name",
      headerName: "Author",
      flex: 1,
    },
    {
      field: "author_position",
      headerName: "Author Position",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>{params.value.charAt(0).toUpperCase() + params.value.slice(1)}</>
        );
      },
    },
    {
      field: "institution_name",
      headerName: "Institution",
      flex: 1,
    },
    {
      field: "institution_state",
      headerName: "State",
      flex: 1,
    },
  ];

  return (
    <Box>
      <DataGrid
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal",
          },
          "& .MuiDataGrid-columnHeader": {
            // Forced to use important since overriding inline styles
            height: "unset !important",
          },
          ".MuiDataGrid-cell": {
            padding: 1,
          },
        }}
        rows={data.publications}
        getRowId={(row) => row.rowId}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: {
            sortModel: [{ field: "publication_year", sort: "desc" }],
          },
        }}
        showToolbar
        slots={{
          noRowsOverlay: () => (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              No publications match selected filters.
            </Box>
          ),
          toolbar: CustomToolbar,
        }}
        loading={data.loading}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "linear-progress",
          },
        }}
        getRowHeight={() => "auto"}
        disableColumnFilter
        disableColumnSelector
        disableRowSelectionOnClick
        disableColumnResize
      />
    </Box>
  );
};
