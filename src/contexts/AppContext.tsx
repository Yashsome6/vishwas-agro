import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockData } from "@/lib/mockData";
import { dataManager } from "@/lib/dataManager";

interface AppContextType {
  data: typeof mockData;
  updateData: (key: keyof typeof mockData, value: any) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<typeof mockData>(mockData);
  const [loading, setLoading] = useState(true);

  // Initialize data from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await dataManager.getAllData();
        setData(storedData as typeof mockData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to mock data
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateData = async (key: keyof typeof mockData, value: any) => {
    // Optimistic update
    setData((prev: typeof mockData) => ({ ...prev, [key]: value }));
    
    // Persist to IndexedDB
    try {
      await dataManager.updateData(key, value);
    } catch (error) {
      console.error(`Failed to persist ${key}:`, error);
      // Could revert optimistic update here if needed
    }
  };

  return (
    <AppContext.Provider value={{ data, updateData, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used within AppProvider");
  return context;
}
