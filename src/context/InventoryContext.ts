import { createContext, useContext } from 'react';
import { InventoryDBSchema } from '@/types/inventoryTypes';

type InventoryContextType = {
  items: InventoryDBSchema;
  updateItems: (data: InventoryDBSchema) => void;
};

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("Item context not found");
  }
  return context;
}