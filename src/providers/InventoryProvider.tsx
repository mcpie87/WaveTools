'use client';

import { ReactNode, useState } from 'react';
import { InventoryDBSchema } from '@/types/inventoryTypes';
import { InventoryContext } from '@/context/InventoryContext';
import LocalStorageService from '@/services/LocalStorageService';

const storageService = new LocalStorageService("items");
interface InventoryProviderProps {
  children: ReactNode;
}
export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [items, setItems] = useState<InventoryDBSchema>(() =>
    storageService.load() as InventoryDBSchema || {}
  );

  const updateItems = (data: InventoryDBSchema) => {
    const cloned = JSON.parse(JSON.stringify(data));
    storageService.save(cloned);
    setItems(cloned);
  };

  return (
    <InventoryContext.Provider value={{ items, updateItems }}>
      {children}
    </InventoryContext.Provider>
  );
};