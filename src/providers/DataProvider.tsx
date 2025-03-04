'use client';

import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";
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
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        console.log("fetchData", "basePath", basePath, "env", process.env.NEXT_PUBLIC_BASE_PATH)
        const itemsResponse = await fetch(`${basePath}/data/items.json`);
        const itemsResponse2 = await fetch(`/data/items.json`);
        const itemsResponse3 = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/data/items.json`);
        const itemsDb: IAPIItem[] = await itemsResponse.json();
        console.log(itemsResponse2?.json());
        console.log(itemsResponse3?.json());

        const resonatorResponse = await fetch(`${basePath}/data/resonator.json`);
        const resonatorDb: IAPIResonator[] = await resonatorResponse.json();

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