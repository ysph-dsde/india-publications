import Papa from "papaparse";
import csvText from "../assets/data/population_by_year.csv?raw";

export interface StateYearData {
  state: string;
  population: number;
  proportion: number;
}

export type PopulationData = Map<string, StateYearData[]>;
export type RawPopulationData = Map<string, Map<string, number>>;

let cachedRawData: RawPopulationData | null = null;

const createEmptyRawMap = (): RawPopulationData =>
  new Map<string, Map<string, number>>();

export const loadRawPopulationData = async (): Promise<RawPopulationData> => {
  if (cachedRawData) {
    return cachedRawData;
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

    // ensure there is data with headers
    const parsedData = results.data as Record<string, any>[];
    if (!parsedData.length || !results.meta?.fields) {
      console.warn("No data or headers found in CSV");
      return (cachedRawData = createEmptyRawMap());
    }

    // extract the years
    const years = new Set(
      (results.meta.fields as string[]).flatMap((header) => {
        const match = header.match(/^(\d{4})_population$/);
        return match ? [match[1]] : [];
      }),
    );

    // ensure there is at least 1 year
    if (years.size === 0) {
      console.warn(
        "No valid year columns found (expected format: {year}_population)",
      );
      return (cachedRawData = createEmptyRawMap());
    }

    // parse data
    const rawData = new Map<string, Map<string, number>>();
    years.forEach((year) => {
      const yearMap = new Map<string, number>();
      parsedData.forEach((row) => {
        const state = row.state as string;
        const population = row[`${year}_population`] as number;
        yearMap.set(state, population);
      });
      rawData.set(year, yearMap);
    });

    return (cachedRawData = rawData);
  } catch (error) {
    console.error("Error loading population data:", error);
    return (cachedRawData = createEmptyRawMap());
  }
};

export const computePopulationData = (
  selectedStates: string[],
  rawData: RawPopulationData,
): PopulationData => {
  const dataMap: PopulationData = new Map();

  for (const [year, statePopulation] of rawData.entries()) {
    const selectedWithData = selectedStates.filter((state) =>
      statePopulation.has(state),
    );
    let total = 0;
    for (const state of selectedWithData) {
      total += statePopulation.get(state)!;
    }

    const yearData: StateYearData[] = [];
    for (const [state, pop] of statePopulation.entries()) {
      const proportion = selectedStates.includes(state)
        ? total > 0
          ? pop / total
          : NaN
        : NaN;
      yearData.push({ state, population: pop, proportion });
    }

    dataMap.set(year, yearData);
  }

  return dataMap;
};
