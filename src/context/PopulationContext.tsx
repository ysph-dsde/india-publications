import { createContext, useContext, useEffect, useState } from "react";
import {
  loadPopulationData,
  type PopulationData,
} from "../services/PopulationDataService";

interface PopulationContextType {
  populationData: PopulationData[];
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
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await loadPopulationData("/india_population.csv");
        setPopulationData(data);
      } catch (err) {
        setError("Failed to load population data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <PopulationContext.Provider value={{ populationData, isLoading, error }}>
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
