import Papa from "papaparse";
import csvText from "../assets/data/data_hdi.csv?raw"

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

export const getHdiData = () => {
  const parseHdiData = (csvContent: string): HdiDataRawData[] => {
    try {
      const results = Papa.parse<HdiDataRawData>(csvContent, {
        header: true,
        dynamicTyping: true, // Auto-convert numbers
      });
      if (results.errors.length > 0) {
        console.error("CSV Parsing Errors:", results.errors);
        return [];
      }
      return results.data;
    } catch (error) {
      console.error("Error parsing HDI data:", error);
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
  const rawData = parseHdiData(csvText);
  return groupHdiData(rawData);
};
