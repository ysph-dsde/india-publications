import Papa from "papaparse";

interface HdiDataRawData {
  State: string;
  Year: number;
  HDI: number;
}

export interface HdiGroupedDataPoint {
  year: number;
  hdi: number;
}

export type GroupedData = { [state: string]: HdiGroupedDataPoint[] };

let cachedData: GroupedData | null = null;

const parseHdiData = async (csvUrl: string): Promise<HdiDataRawData[]> => {
  try {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    const results = await new Promise<HdiDataRawData[]>((resolve, reject) => {
      Papa.parse<HdiDataRawData>(csvText, {
        header: true,
        dynamicTyping: true, // Auto-convert numbers
        complete: (result) => {
          const data = result.data;
          resolve(data);
        },
        error: (error: any) => {
          console.error("CSV Parsing Error:", error);
          reject(error);
        },
      });
    });
    return results;
  } catch (error) {
    console.error("Error loading HDI data:", error);
    return [];
  }
};

const groupHdiData = (rawData: HdiDataRawData[]): GroupedData => {
  const grouped: GroupedData = {};
  rawData.forEach((row) => {
    const state = row.State;
    if (!grouped[state]) grouped[state] = [];
    grouped[state].push({ year: row.Year, hdi: row.HDI });
    Object.values(grouped).forEach((points) => {
      points.sort(
        (a: HdiGroupedDataPoint, b: HdiGroupedDataPoint) => a.year - b.year,
      );
    });
  });
  return grouped;
};

export const loadHdiData = async () => {
  if (cachedData) {
    return cachedData; // Return cached data if already loaded
  }
  try {
    const rawData = await parseHdiData("/assets/data_hdi.csv");
    cachedData = groupHdiData(rawData);
    return cachedData;
  } catch (error) {
    console.error("Error loading CSV:", error);
    throw error;
  }
};
