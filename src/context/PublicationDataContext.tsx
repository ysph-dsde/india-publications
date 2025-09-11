import {
  createContext,
  useCallback,
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
  cancelSearch: () => void;
  clearError: () => void;
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
  // default filters
  const [serverFilters, setServerFilters] = useState<ServerFilters>({
    topic: "Custom Keyword Search",
    customKeyword: "",
    yearRange: [2014, 2024],
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
    progress: { "title.search": 0, "abstract.search": 0 },
    error: null,
  });

  // Callback to update progress for a specific searchField
  const setProgress = useCallback((searchField: string, value: number) => {
    setData((prev) => ({
      ...prev,
      progress: { ...prev.progress, [searchField]: value },
    }));
  }, []);

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

  const previousServerFiltersRef = useRef<ServerFilters>(serverFilters);
  const controllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef<Symbol | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;

    const fetchId = Symbol();
    isFetchingRef.current = fetchId;

    // Set loading true, backup previous search, clear current data
    setData((prev) => ({
      ...prev,
      loading: true,
      progress: { "title.search": 0, "abstract.search": 0 },
      error: null,
    }));
    const dataBackup: FlattenedPublication[] = [...sourceData];
    setSourceData([]);

    const loadData = async () => {
      try {
        if (
          serverFilters.topic !== "Custom Keyword Search" ||
          serverFilters.customKeyword.length !== 0
        ) {
          for await (const page of fetchOpenAlexData(
            serverFilters,
            signal,
            setProgress,
          )) {
            // progressively add data as it loads
            setSourceData((prev) => [...prev, ...page]);
          }
        }

        // update server filters if not cancelled
        if (!signal.aborted) {
          previousServerFiltersRef.current = serverFilters;
        }

        // Always set loading false on completion (success or not)
        setData((prev) => ({
          ...prev,
          loading: false,
        }));
      } catch (error) {
        // Fetch aborted due to user cancellation.
        if (signal.aborted) {
          // revert to previous data source
          setSourceData([...dataBackup]);
          setData((prev) => ({
            ...prev,
            loading: false,
            error: "Search cancelled",
          }));
          return;
        }
        // On non-abort error, set error but keep previous sourceData
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load data",
        }));
      } finally {
        if (isFetchingRef.current === fetchId) {
          isFetchingRef.current = null;
          controllerRef.current = null;
        }
      }
    };
    loadData();

    return () => {
      controller.abort(); // Cancel any in-progress query
    };
  }, [serverFilters]);

  const updateServerFilters = (newFilters: Partial<ServerFilters>) => {
    setServerFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updateClientFilters = (newFilters: Partial<ClientFilters>) => {
    setClientFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const cancelSearch = () => {
    if (controllerRef.current) {
      setServerFilters(previousServerFiltersRef.current);
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  };

  const clearError = () => {
    setData((prev) => ({ ...prev, error: null }));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        serverFilters,
        clientFilters,
        updateServerFilters,
        updateClientFilters,
        cancelSearch,
        clearError,
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
