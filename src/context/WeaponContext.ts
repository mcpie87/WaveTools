import { createContext, useContext } from 'react';
import { WeaponDBSchema, WeaponStateDBEntry } from '@/types/weaponTypes';

type WeaponContextType = {
  weapons: WeaponDBSchema;
  updateWeapon: (id: string, data: WeaponStateDBEntry) => void;
  deleteWeapon: (id: string, index: number) => void;
  updatePriorities: (newWeapons: WeaponStateDBEntry[]) => void;
};

export const WeaponContext = createContext<WeaponContextType | undefined>(undefined);

export const useWeapons = () => {
  const context = useContext(WeaponContext);
  if (!context) {
    throw new Error("Weapon context not found");
  }
  return context;
}