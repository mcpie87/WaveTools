'use client';

import { IItem, IResonator } from "@/app/interfaces/api_interfaces";
import { DataContext, DataContextType } from "@/context/DataContext";
import { ReactNode, useEffect, useState } from "react";

interface DataProviderProps {
  children: ReactNode;
};
export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<DataContextType['data']>(null);
  const [loading, setLoading] = useState<DataContextType['loading']>(true);
  const [error, setError] = useState<DataContextType['error']>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("FETCH DATA!");
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        console.log("basepath", basePath);
        console.log("is prod?", process.env.NODE_ENV);
        const itemsResponse = await fetch(`${basePath}/data/items.json`);
        const itemsDb: IItem[] = await itemsResponse.json();

        const resonatorResponse = await fetch(`${basePath}/data/resonator.json`);
        const resonatorDb: IResonator[] = await resonatorResponse.json();
        console.log("FETCH DATA END!");

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