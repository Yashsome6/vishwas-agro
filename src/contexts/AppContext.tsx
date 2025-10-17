import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockData } from "@/lib/mockData";

interface AppContextType {
  data: typeof mockData;
  updateData: (key: keyof typeof mockData, value: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem("agroErpData");
    return stored ? JSON.parse(stored) : mockData;
  });

  useEffect(() => {
    localStorage.setItem("agroErpData", JSON.stringify(data));
  }, [data]);

  const updateData = (key: keyof typeof mockData, value: any) => {
    setData((prev: typeof mockData) => ({ ...prev, [key]: value }));
  };

  return (
    <AppContext.Provider value={{ data, updateData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used within AppProvider");
  return context;
}
