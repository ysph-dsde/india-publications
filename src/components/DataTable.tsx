import {
  Box,
  // IconButton,
  Link,
  // Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  // ExportCsv,
  // Toolbar,
  // ToolbarButton,
  type GridColDef,
} from "@mui/x-data-grid";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { useData } from "../context/PublicationDataContext";

// function CustomToolbar() {
//   return (
//     <Toolbar>
//       <ExportCsv
//         options={{
//           allColumns: true, // Export all columns
//           fileName: "publications_data", // Custom file name
//         }}
//         render={
//           <Tooltip title={"Export"}>
//             <ToolbarButton
//               render={
//                 <IconButton>
//                   <FileDownloadIcon fontSize="small" />
//                 </IconButton>
//               }
//             />
//           </Tooltip>
//         }
//       />
//       {/* <QuickFilter/> */}
//     </Toolbar>
//   );
// }

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
      {data.error && <Typography color="error">{data.error}</Typography>}
      {!data.error && (
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
            // sorting: {
            //   sortModel: [{ field: "publication_year", sort: "desc" }],
            // },
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
            // toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              csvOptions: { allColumns: true, fileName: "publications_data" },
            },
          }}
          getRowHeight={() => "auto"}
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnResize
        />
      )}
    </Box>
  );
};
