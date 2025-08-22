import { createContext, useContext, useEffect, useState } from "react";
import { loadHdiData, type GroupedData } from "../services/HdiDataService";

interface HdiContextType {
  hdiData: GroupedData | null;
  isLoading: boolean;
  error: string | null;
}

const HdiContext = createContext<HdiContextType | undefined>(undefined);

export const HdiProvider = ({ children }: { children: React.ReactNode }) => {
  const [hdiData, setHdiData] = useState<GroupedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await loadHdiData();
        setHdiData(data);
      } catch (err) {
        setError("Failed to load HDI data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <HdiContext.Provider value={{ hdiData, isLoading, error }}>
      {children}
    </HdiContext.Provider>
  );
};

export const useHdiData = () => {
  const context = useContext(HdiContext);
  if (!context) {
    throw new Error("useHdiData must be used within a HdiProvider");
  }
  return context;
};
