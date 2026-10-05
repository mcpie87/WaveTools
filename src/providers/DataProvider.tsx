'use client';

import { IAPIItem, IAPIResonator, IAPIWeapon } from "@/app/interfaces/api_interfaces";
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
        const paths = ["items_minified.json", "resonators_minified.json", "weapons_minified.json"] as const;
        const [itemsResponse, resonatorResponse, weaponsResponse] = await Promise.all([
          fetch(`${basePath}/data/${paths[0]}`),
          fetch(`${basePath}/data/${paths[1]}`),
          fetch(`${basePath}/data/${paths[2]}`),
        ]);

        for (const [index, response] of [itemsResponse, resonatorResponse, weaponsResponse].entries()) {
          if (!response.ok) {
            throw new Error(`Failed to load ${paths[index]} (${response.status} ${response.statusText})`);
          }
        }

        const [itemsDb, resonatorDb, weaponsDb]: [IAPIItem[], IAPIResonator[], IAPIWeapon[]] = await Promise.all(
          [itemsResponse.json(), resonatorResponse.json(), weaponsResponse.json()]
        );

        setData({
          items: itemsDb,
          resonators: resonatorDb,
          weapons: weaponsDb.filter(weapon => weapon.rarity >= 3), // we don't support 1/2 stars for now
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
