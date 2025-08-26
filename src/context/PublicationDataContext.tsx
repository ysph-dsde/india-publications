import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type FlattenedPublication,
  type DataState,
  type ServerFilters,
  type ClientFilters,
  type YearlyPublication,
  type StateYearlyPublication,
  type totalPublicationsByState,
} from "./types";
import { fetchOpenAlexData } from "../services/OpenAlexService";
import { States } from "../constants/States";

interface DataContextType {
  data: DataState;
  clientFilters: ClientFilters;
  serverFilters: ServerFilters;
  updateServerFilters: (newFilters: Partial<ServerFilters>) => void;
  updateClientFilters: (newFilters: Partial<ClientFilters>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const prepareChartData = (
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

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // default filters: ensure the visual in Sidebar matches
  const [serverFilters, setServerFilters] = useState<ServerFilters>({
    topic: "Digital Health",
    customKeyword: "",
    yearRange: [2014, 2018],
  });
  const [clientFilters, setClientFilters] = useState<ClientFilters>({
    authorPosition: "First",
    minimumCitations: 0,
    grantInformation: "Any",
    states: [...States],
    populationGroups: ["high", "medium", "low"],
  });
  const [sourceData, setSourceData] = useState<FlattenedPublication[]>([]);
  const [data, setData] = useState<DataState>({
    publications: [],
    yearlyData: [],
    stateYearlyData: [],
    totalPublicationsByState: [],
    loading: true,
    error: null,
  });

  // Client-side filtering (doesn't trigger API call)
  const filteredPublications = useMemo(() => {
    return sourceData.filter((pub) => {
      const matchesAuthorPosition =
        clientFilters.authorPosition === "Any" ||
        (clientFilters.authorPosition === "First" &&
          pub.author_position.toLowerCase() === "first") ||
        (clientFilters.authorPosition === "First and last" &&
          (pub.author_position.toLowerCase() === "first" ||
            pub.author_position.toLowerCase() === "last"));

      const matchesCitations =
        pub.cited_by_count >= clientFilters.minimumCitations;

      const matchesGrant =
        clientFilters.grantInformation === "Any" ||
        (clientFilters.grantInformation === "Yes" && pub.grants.length > 0) ||
        (clientFilters.grantInformation === "No" && pub.grants.length === 0);

      const matchesStates = clientFilters.states.includes(
        pub.institution_state,
      );

      return (
        matchesAuthorPosition &&
        matchesCitations &&
        matchesGrant &&
        matchesStates
      );
    });
  }, [serverFilters, clientFilters, sourceData]);

  const { yearlyData, yearlyDataByState, totalPublicationsByState } =
    useMemo(() => {
      return prepareChartData(filteredPublications);
    }, [filteredPublications]);

  // update publications in table when source data OR filters change
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      publications: filteredPublications,
      yearlyData: yearlyData,
      stateYearlyData: yearlyDataByState,
      totalPublicationsByState: totalPublicationsByState,
    }));
  }, [
    filteredPublications,
    yearlyData,
    yearlyDataByState,
    totalPublicationsByState,
  ]);

  const isFetchingRef = useRef<Symbol | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchId = Symbol();
    isFetchingRef.current = fetchId;

    // Clear data explicitly before fetching
    setData((prev) => ({ ...prev, loading: true, error: null }));
    setSourceData([]);

    const loadData = async () => {
      try {
        const allPublications: FlattenedPublication[] = [];
        for await (const page of fetchOpenAlexData(serverFilters, signal)) {
          allPublications.push(...page);
        }
        setSourceData(allPublications);

        setData((prev) => ({
          ...prev,
          loading: false,
        }));
      } catch (error) {
        if (signal.aborted) {
          console.info("Fetch aborted due to filter change.");
          return;
        }
        setSourceData([]);
        setData({
          publications: [],
          yearlyData: [],
          stateYearlyData: [],
          totalPublicationsByState: [],
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load data",
        });
      } finally {
        if (isFetchingRef.current === fetchId) isFetchingRef.current = null;
      }
    };
    loadData();

    return () => {
      controller.abort(); // Cancel any in-progress query
    };
  }, [serverFilters]);

  const updateServerFilters = (newFilters: Partial<ServerFilters>) => {
    // console.log("Updating serverFilters:", newFilters);
    setServerFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updateClientFilters = (newFilters: Partial<ClientFilters>) => {
    // console.log("Updating clientFilters:", newFilters);
    setClientFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        serverFilters,
        clientFilters,
        updateServerFilters,
        updateClientFilters,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
