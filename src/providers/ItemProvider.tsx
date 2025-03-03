'use client';

import { ReactNode, useState, useEffect } from 'react';
import { ItemStateDBSchema } from '@/types/itemTypes';
import { ItemContext } from '@/context/ItemContext';
import { getStorageKey } from '@/utils/utils';

interface ItemProviderProps {
  children: ReactNode;
}
export const ItemProvider = ({ children }: ItemProviderProps) => {
  const [items, setItems] = useState<ItemStateDBSchema>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(getStorageKey('items'));
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("items save", items);
      localStorage.setItem(getStorageKey('items'), JSON.stringify(items));
    }
  }, [items]);

  const updateItems = (data: ItemStateDBSchema) => {
    console.log("updateItems", data)
    setItems(data);
  };

  return (
    <ItemContext.Provider value={{ items, updateItems }}>
      {children}
    </ItemContext.Provider>
  );
};