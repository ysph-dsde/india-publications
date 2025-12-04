import {
  DataGrid,
  ExportCsv,
  Toolbar,
  ToolbarButton,
  type GridColDef,
} from "@mui/x-data-grid";
import { useData } from "../../../context/PublicationDataContext";
import { ToolbarSearch } from "./ToolbarSearch";
import { ExportTopInstitutions } from "./TopInstitutions";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { theme } from "../../../Theme";
import { DownloadButton } from "../../shared/DownloadButton";

const CustomToolbar = () => {
  const {
    data: { publications, loading },
  } = useData();

  return (
    <Toolbar
      render={(props) => (
        <>
          {publications.length > 0 && !loading && (
            <Box
              {...props}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-end", sm: "center" },
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: { xs: 1, sm: 2 },
                p: 1,
                borderBottom: 1,
                borderBottomColor: theme.palette.gray.light,
              }}
            />
          )}
        </>
      )}
    >
      <ExportCsv
        options={{
          allColumns: true,
          fileName:
            "publications_data - Yale School of Public Health Data Science and Data Equity",
        }}
        render={
          <Tooltip title={"Download all"}>
            <ToolbarButton
              render={<DownloadButton>Download all data</DownloadButton>}
            />
          </Tooltip>
        }
      />
      <ExportTopInstitutions />
      <ToolbarSearch />
    </Toolbar>
  );
};

export const DataTable = () => {
  const { data } = useData();

  const columns: GridColDef[] = [
    {
      field: "publication_year",
      headerName: "Year",
      width: 125,
      maxWidth: 125,
      minWidth: 125,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
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
      width: 150,
      maxWidth: 150,
      minWidth: 150,
    },
    {
      field: "author_name",
      headerName: "Author",
      flex: 1,
      minWidth: 125,
    },
    {
      field: "author_position",
      headerName: "Author Position",
      width: 150,
      maxWidth: 150,
      minWidth: 150,
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
      minWidth: 150,
    },
    {
      field: "institution_state",
      headerName: "State / Territory",
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <Paper elevation={1}>
      <DataGrid
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal",
          },
          "& .MuiDataGrid-columnHeader": {
            // important since overriding inline styles
            height: "unset !important",
          },
          ".MuiDataGrid-cell": {
            padding: 1,
          },
          borderRadius: "inherit",
          height: 1000,
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
    </Paper>
  );
};
