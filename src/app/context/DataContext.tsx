import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ItemInterface {
  id: number;
  name: string;
  attributes_description: string;
  bg_description: string;
  icon: string;
  icon_middle: string;
  icon_small: string;
  rarity: number;
}

interface ResonatorInterface {
  id: number;
  name: string;
}


export interface DataContextType {
  data: { items: ItemInterface[]; resonators: ResonatorInterface[] } | null;
  loading: boolean;
  error: Error | null;
}
const DataContext = createContext<DataContextType | undefined>(undefined);


interface DataProviderProps {
  children: ReactNode
};
export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<DataContextType['data']>(null);
  const [loading, setLoading] = useState<DataContextType['loading']>(true);
  const [error, setError] = useState<DataContextType['error']>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const itemsResponse = await fetch('/data/items.json');
        const itemsDb: ItemInterface[] = await itemsResponse.json();

        const resonatorResponse = await fetch('/data/resonator.json');
        const resonatorDb = await resonatorResponse.json();

        setData({
          items: itemsDb,
          resonators: resonatorDb,
        });
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);