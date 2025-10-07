import type {
  FlattenedPublication,
  StateYearlyPublication,
  YearlyPublication,
  totalPublicationsByState,
} from "../context/types";

export const prepareChartData = (
  publications: FlattenedPublication[],
): {
  yearlyData: YearlyPublication[];
  yearlyDataByState: StateYearlyPublication[];
  totalPublicationsByState: totalPublicationsByState[];
} => {
  const yearCounts: { [year: number]: number } = {};
  const yearStateCounts: { [year: number]: { [state: string]: number } } = {};
  const stateTotals: { [state: string]: number } = {};

  publications.forEach((pub) => {
    const { publication_year, institution_state } = pub;

    // Count publications per year
    yearCounts[publication_year] = (yearCounts[publication_year] || 0) + 1;

    // Count publications per year by state
    const state = institution_state || "State Unknown";
    if (!yearStateCounts[publication_year]) {
      yearStateCounts[publication_year] = {};
    }
    yearStateCounts[publication_year][state] =
      (yearStateCounts[publication_year][state] || 0) + 1;

    // Count total publications per state
    stateTotals[state] = (stateTotals[state] || 0) + 1;
  });

  // Get all unique states across all years
  const allStates = [
    ...new Set(
      Object.values(yearStateCounts).flatMap((stateCounts) =>
        Object.keys(stateCounts),
      ),
    ),
  ];

  // Convert year counts to sorted array
  const yearlyData: YearlyPublication[] = Object.entries(yearCounts)
    .map(([year, count]) => ({
      year: parseInt(year),
      count,
    }))
    .sort((a, b) => a.year - b.year);

  // Convert year-state counts to sorted yearlyDataByState
  const yearlyDataByState: StateYearlyPublication[] = Object.keys(
    yearStateCounts,
  )
    .map((year) => {
      const yearNum = parseInt(year);
      // Create states object with 0 for missing states
      const states = Object.fromEntries(
        allStates.map((state) => [state, yearStateCounts[yearNum][state] || 0]),
      );
      return { year: yearNum, states };
    })
    .sort((a, b) => a.year - b.year);

  // Convert state totals to array
  const totalPublicationsByState = Object.entries(stateTotals).map(
    ([state, count]) => ({ state, count }),
  );

  return { yearlyData, yearlyDataByState, totalPublicationsByState };
};
