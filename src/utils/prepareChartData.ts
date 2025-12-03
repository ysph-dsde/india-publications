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
  totalPublications: number;
} => {
  const yearStateIds: { [year: number]: { [state: string]: Set<string> } } = {};
  const stateIds: { [state: string]: Set<string> } = {};

  publications.forEach((pub) => {
    const { publication_year, institution_state, id } = pub;
    const state = institution_state || "State Unknown";

    // Per-year per-state unique IDs
    if (!yearStateIds[publication_year]) {
      yearStateIds[publication_year] = {};
    }
    if (!yearStateIds[publication_year][state]) {
      yearStateIds[publication_year][state] = new Set();
    }
    yearStateIds[publication_year][state].add(id);

    // Overall per-state unique IDs
    if (!stateIds[state]) {
      stateIds[state] = new Set();
    }
    stateIds[state].add(id);
  });

  // Get all unique states across all years
  const allStates = [
    ...new Set(
      Object.values(yearStateIds).flatMap((stateMap) => Object.keys(stateMap)),
    ),
  ];

  // Convert to sorted yearlyData (total unique publication-state pairs per year)
  const yearlyData: YearlyPublication[] = Object.keys(yearStateIds)
    .map((year) => {
      const y = parseInt(year);
      const count = Object.values(yearStateIds[y]).reduce(
        (sum, idSet) => sum + idSet.size,
        0,
      );
      return { year: y, count };
    })
    .sort((a, b) => a.year - b.year);

  // Convert to sorted yearlyDataByState (with 0 for missing states)
  const yearlyDataByState: StateYearlyPublication[] = Object.keys(yearStateIds)
    .map((year) => {
      const y = parseInt(year);
      const states = Object.fromEntries(
        allStates.map((state) => [state, yearStateIds[y][state]?.size || 0]),
      );
      return { year: y, states };
    })
    .sort((a, b) => a.year - b.year);

  // Convert overall state unique ID counts to array
  const totalPublicationsByState = Object.entries(stateIds).map(
    ([state, idSet]) => ({ state, count: idSet.size }),
  );

  // Convert to total publications
  const totalPublications = totalPublicationsByState.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return {
    yearlyData,
    yearlyDataByState,
    totalPublicationsByState,
    totalPublications,
  };
};
