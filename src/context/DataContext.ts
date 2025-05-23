import { createContext, useContext } from 'react';
import { IAPIItem, IAPIResonator, IAPIWeapon } from '../app/interfaces/api_interfaces';

export interface DataContextType {
  data: {
    items: IAPIItem[];
    resonators: IAPIResonator[];
    weapons: IAPIWeapon[];
  } | null;
  loading: boolean;
  error: Error | null;
}
export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}