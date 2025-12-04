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
} from "./types";
import { fetchOpenAlexData } from "../services/OpenAlexService";
import { States } from "../constants/States";
import { prepareChartData } from "../utils/prepareChartData";
import { ArticleTypes } from "../constants/FilterTypes";

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

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // default filters
  const [serverFilters, setServerFilters] = useState<ServerFilters>({
    topic: "Electronic Health Records",
    customKeyword: "",
    yearRange: [2014, 2024],
  });
  const [clientFilters, setClientFilters] = useState<ClientFilters>({
    authorPosition: "First",
    minimumCitations: 0,
    grantInformation: "Any",
    states: [...States],
    populationGroups: ["high", "medium", "low"],
    articleTypes: [...ArticleTypes],
  });
  const [sourceData, setSourceData] = useState<FlattenedPublication[]>([]);
  // defualt data
  const [data, setData] = useState<DataState>({
    publications: [],
    totalPublications: 0,
    yearlyData: [],
    stateYearlyData: [],
    totalPublicationsByState: [],
    loading: true,
    progress: { "title.search": 0, "abstract.search": 0 },
    error: null,
  });

  // Client-side filtering (doesn't trigger API call)
  const filteredPublications = useMemo(() => {
    return sourceData.filter((pub) => {
      const matchesAuthorPosition =
        clientFilters.authorPosition === "Any" ||
        (clientFilters.authorPosition === "First" &&
          pub.author_position.toLowerCase() === "first") ||
        (clientFilters.authorPosition === "Last" &&
          pub.author_position.toLowerCase() === "last") ||
        (clientFilters.authorPosition === "First or last" &&
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

      const matchesArticleTypes = clientFilters.articleTypes.includes(pub.type);

      return (
        matchesAuthorPosition &&
        matchesCitations &&
        matchesGrant &&
        matchesStates &&
        matchesArticleTypes
      );
    });
  }, [serverFilters, clientFilters, sourceData]);

  // update data used for plotting
  const {
    yearlyData,
    yearlyDataByState,
    totalPublicationsByState,
    totalPublications,
  } = useMemo(() => {
    return prepareChartData(filteredPublications);
  }, [filteredPublications]);

  // update data when source data OR filters change
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      publications: filteredPublications,
      yearlyData: yearlyData,
      stateYearlyData: yearlyDataByState,
      totalPublicationsByState: totalPublicationsByState,
      totalPublications: totalPublications,
    }));
  }, [
    filteredPublications,
    yearlyData,
    yearlyDataByState,
    totalPublicationsByState,
    totalPublications,
  ]);

  // Callback to update progress for a specific searchField
  const setProgress = useCallback((searchField: string, value: number) => {
    setData((prev) => ({
      ...prev,
      progress: { ...prev.progress, [searchField]: value },
    }));
  }, []);

  // for use in data fetching
  const previousServerFiltersRef = useRef<ServerFilters>(serverFilters);
  const lastCompletedDataRef = useRef<FlattenedPublication[]>([]);
  const controllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef<Symbol | null>(null);
  const isCancellingRef = useRef<boolean>(false);

  // fetch data when server filters are changed
  useEffect(() => {
    if (isCancellingRef.current) {
      isCancellingRef.current = false;
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;

    const fetchId = Symbol();
    isFetchingRef.current = fetchId;

    // Set loading true, progress to 0
    setData((prev) => ({
      ...prev,
      loading: true,
      progress: { "title.search": 0, "abstract.search": 0 },
      error: null,
    }));
    // clear data
    setSourceData([]);

    const loadData = async () => {
      // data accumulator for local use
      let accumulatedData: FlattenedPublication[] = [];

      try {
        for await (const page of fetchOpenAlexData(
          serverFilters,
          signal,
          (searchField: string, value: number) => {
            if (isFetchingRef.current === fetchId) {
              setProgress(searchField, value);
            }
          },
        )) {
          if (isFetchingRef.current === fetchId) {
            // progressively add data as it loads
            setSourceData((prev) => [...prev, ...page]);
            accumulatedData = [...accumulatedData, ...page];
          }
        }
        if (isFetchingRef.current === fetchId) {
          // Update refs on successful completion
          previousServerFiltersRef.current = serverFilters;
          lastCompletedDataRef.current = accumulatedData;
        }
      } catch (error) {
        if (isFetchingRef.current === fetchId) {
          if (signal.aborted) {
            // revert to previous data source on search cancellation
            setSourceData([...lastCompletedDataRef.current]);
          } else {
            // set error message and leave the user with partially loaded data
            setData((prev) => ({
              ...prev,
              error:
                error instanceof Error ? error.message : "Failed to load data",
            }));
          }
        }
      } finally {
        if (isFetchingRef.current === fetchId) {
          // set loading to false after process finishes
          setData((prev) => ({
            ...prev,
            loading: false,
          }));
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
      isCancellingRef.current = true;
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
