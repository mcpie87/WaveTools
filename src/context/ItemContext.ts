import { createContext, useContext } from 'react';
import { ItemStateDBSchema } from '@/types/itemTypes';

type ItemContextType = {
  items: ItemStateDBSchema;
  updateItems: (data: ItemStateDBSchema) => void;
};

export const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => useContext(ItemContext);