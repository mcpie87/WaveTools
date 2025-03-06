'use client';

import { ReactNode, useState, useEffect } from 'react';
import { InventoryDBSchema } from '@/types/inventoryTypes';
import { InventoryContext } from '@/context/InventoryContext';
import LocalStorageService from '@/services/LocalStorageService';

const storageService = new LocalStorageService("items");
interface InventoryProviderProps {
  children: ReactNode;
}
export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [items, setItems] = useState<InventoryDBSchema>(() => {
    return storageService.load() as InventoryDBSchema || {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("items save", items);
      storageService.save(items);
    }
  }, [items]);

  const updateItems = (data: InventoryDBSchema) => {
    setItems(data);
  };

  return (
    <InventoryContext.Provider value={{ items, updateItems }}>
      {children}
    </InventoryContext.Provider>
  );
};