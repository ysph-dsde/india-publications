import Papa from "papaparse";

export interface PopulationData {
  state: string;
  population: number;
  proportion: number;
}

let cachedData: PopulationData[] | null = null;

export const loadPopulationData = async (
  csvUrl: string,
): Promise<PopulationData[]> => {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    const results = await new Promise<PopulationData[]>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true, // Auto-convert numbers
        complete: (result) => {
          const data = result.data as {
            state: string;
            population: number;
            proportion: number;
          }[];
          resolve(data);
        },
        error: (error: any) => {
          console.error("CSV Parsing Error:", error);
          reject(error);
        },
      });
    });
    cachedData = results;
    return results;
  } catch (error) {
    console.error("Error loading population data:", error);
    return [];
  }
};
