import Papa from "papaparse";
import csvText from "../assets/population_by_year.csv?raw";

export interface StateYearData {
  state: string;
  population: number;
  proportion: number;
}

export type PopulationData = Map<string, StateYearData[]>;

let cachedData: PopulationData | null = null;

const createEmptyMap = (): PopulationData => new Map<string, StateYearData[]>();

const validateRow = (
  row: Record<string, any>,
  year: string,
): StateYearData | null => {
  const state = row.state;
  const population = row[`${year}_population`];
  const proportion = row[`${year}_proportion`];

  if (
    typeof state !== "string" ||
    state.trim() === "" ||
    population == null ||
    proportion == null ||
    typeof population !== "number" ||
    typeof proportion !== "number"
  ) {
    if (
      state &&
      (population == null ||
        proportion == null ||
        typeof population !== "number" ||
        typeof proportion !== "number")
    ) {
      console.warn(`Invalid numeric data for ${state} in ${year}`);
    }
    return null;
  }

  return { state, population, proportion };
};

export const loadPopulationData = async (): Promise<PopulationData> => {
  if (cachedData) {
    return cachedData;
  }

  try {
    const results = await new Promise<any>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: resolve,
        error: (error: any) => {
          console.error("CSV Parsing Error:", error);
          reject(error);
        },
      });
    });

    const parsedData = results.data as Record<string, any>[];
    if (!parsedData.length || !results.meta?.fields) {
      console.warn("No data or headers found in CSV");
      return (cachedData = createEmptyMap());
    }

    const years = new Set(
      (results.meta.fields as string[]).flatMap((header) => {
        const match = header.match(/^(\d{4})_population$/);
        return match ? [match[1]] : [];
      }),
    );

    if (years.size === 0) {
      console.warn(
        "No valid year columns found (expected format: {year}_population)",
      );
      return (cachedData = createEmptyMap());
    }

    const dataMap = new Map<string, StateYearData[]>();
    years.forEach((year) => {
      const yearData = parsedData
        .map((row) => validateRow(row, year))
        .filter((item): item is StateYearData => item !== null);

      if (yearData.length > 0) {
        dataMap.set(year, yearData);
      }
    });

    return (cachedData = dataMap);
  } catch (error) {
    console.error("Error loading population data:", error);
    return (cachedData = createEmptyMap());
  }
};
