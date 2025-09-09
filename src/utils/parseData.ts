import type { FlattenedPublication } from "../context/types";
import Papa from "papaparse";

interface InstitutionCsvRow {
  id: string; // ror url
  state: string;
}

const rorToStateMapSingleton: Map<string, string> = new Map<string, string>();

const loadRorToStateMap = async (): Promise<Map<string, string>> => {
  if (rorToStateMapSingleton.size > 0)
    return Promise.resolve(rorToStateMapSingleton);

  // Fetch the CSV file from the public directory
  const csvResponse = await fetch("/data_ror.csv");
  if (!csvResponse.ok) {
    throw new Error("Failed to fetch data_ror.csv");
  }
  const csvData = await csvResponse.text();

  return new Promise((resolve, reject) => {
    Papa.parse<InstitutionCsvRow>(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        result.data.forEach((row, index) => {
          if (row.id && row.state) {
            rorToStateMapSingleton.set(row.id, row.state);
          } else {
            console.warn(`Row ${index} missing ror or state:`, row);
          }
        });
        resolve(rorToStateMapSingleton);
      },
      error: (error: any) => {
        console.error("CSV Parsing Error:", error);
        reject(error);
      },
    });
  });
};

export const parseOpenAlexData = async (
  rawData: any,
): Promise<FlattenedPublication[]> => {
  const rorToStateMap = await loadRorToStateMap();

  const flattened: FlattenedPublication[] = [];

  for (const item of rawData.results) {
    const commonFields = {
      id: item.id,
      title: item.title,
      publication_year: item.publication_year,
      doi: item.doi,
      cited_by_count: item.cited_by_count,
      grants: item.grants || [],
    };

    for (const authorship of item.authorships) {
      const author_name = authorship.author.display_name || "Author Unknown";
      const author_position = authorship.author_position || "Position Unknown";

      // access only the FIRST institution for given author
      if (authorship.institutions && authorship.institutions.length > 0) {
        const institution = authorship.institutions[0];
        flattened.push({
          ...commonFields,
          rowId: `${item.id}-${author_name}`,
          author_name,
          author_position,
          institution_name: institution.display_name || "Institution Unknown",
          institution_ror: institution.ror || "Unknown ROR",
          institution_state:
            institution.ror && rorToStateMap.has(institution.ror)
              ? rorToStateMap.get(institution.ror) || "State Unknown"
              : "State Unknown",
        });
      }
    }
  }

  return flattened;
};
