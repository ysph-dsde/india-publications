import { useMemo } from "react";
import { useData } from "../../../context/PublicationDataContext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

interface InstitutionData {
  institution_name: string;
  institution_state: string;
  publication_count: number;
}

export const TopInstitutions = () => {
  const {
    data: { publications },
  } = useData();

  const institutionData = useMemo<InstitutionData[]>(() => {
    // Build a map with counts and state
    const institutionMap = publications.reduce<
      Record<string, { count: number; state: string }>
    >((acc, pub) => {
      const inst = pub.institution_name;
      if (inst) {
        if (!acc[inst]) {
          acc[inst] = { count: 0, state: pub.institution_state || "Unknown" };
        }
        acc[inst].count += 1;
      }
      return acc;
    }, {});

    // Convert to array, sort by count descending, take top 50
    return Object.entries(institutionMap)
      .map(([name, { count, state }]) => ({
        institution_name: name,
        institution_state: state,
        publication_count: count,
      }))
      .sort((a, b) => b.publication_count - a.publication_count)
      .slice(0, 50);
  }, [publications]);

  const downloadCSV = () => {
    const headers = ["institution", "state", "publication_count"];
    const csvRows = [
      headers.join(","), // Header row
      ...institutionData.map((row) => {
        const quoteIfNeeded = (value: string): string => {
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n") ||
            value.includes("\r")
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        };

        return [
          quoteIfNeeded(row.institution_name),
          quoteIfNeeded(row.institution_state),
          row.publication_count, // Never quote numbers
        ].join(",");
      }),
    ];
    const csvContent = csvRows.join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      "top_institutions - Yale School of Public Health Data Science and Data Equity.csv",
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Tooltip title={"Download top 50 list"}>
      <Button
        onClick={downloadCSV}
        variant="text"
        sx={{
          color: "#707070",
        }}
        size="small"
        endIcon={<FileDownloadIcon fontSize="small" />}
      >
        Download list of top 50 institutions
      </Button>
    </Tooltip>
  );
};
