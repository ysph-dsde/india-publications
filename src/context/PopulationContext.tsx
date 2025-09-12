import { createContext, useContext, useEffect, useState } from "react";
import {
  loadPopulationData,
  type PopulationData,
  type StateYearData,
} from "../services/PopulationDataService";
import { useData } from "./PublicationDataContext";

interface PopulationContextType {
  populationData: PopulationData;
  endYearPopulationData: StateYearData[];
  isLoading: boolean;
  error: string | null;
}

const PopulationContext = createContext<PopulationContextType | undefined>(
  undefined,
);

export const PopulationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [populationData, setPopulationData] = useState<PopulationData>(
    new Map<string, StateYearData[]>(),
  );
  const [endYearPopulationData, setEndYearPopulationData] = useState<
    StateYearData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    serverFilters: { yearRange },
  } = useData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const data = await loadPopulationData("/india_population.csv");
        const data = await loadPopulationData();
        setPopulationData(data);
        console.log(data);
      } catch (err) {
        setError("Failed to load population data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const yearData = populationData.get(yearRange[1].toString());
    if (yearData) setEndYearPopulationData(yearData);
  }, [yearRange, populationData]);

  return (
    <PopulationContext.Provider
      value={{ populationData, endYearPopulationData, isLoading, error }}
    >
      {children}
    </PopulationContext.Provider>
  );
};

export const usePopulationData = () => {
  const context = useContext(PopulationContext);
  if (!context) {
    throw new Error(
      "usePopulationData must be used within a PopulationProvider",
    );
  }
  return context;
};
