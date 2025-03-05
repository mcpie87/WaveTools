import { createContext, useContext } from 'react';
import { WeaponDBSchema, WeaponStateDBEntry } from '@/types/weaponTypes';

type WeaponContextType = {
  weapons: WeaponDBSchema;
  updateWeapon: (id: string, data: WeaponStateDBEntry) => void;
  deleteWeapon: (id: string, index: number) => void;
  updatePriority: (name: string, index: number, newPriority: number) => void;
};

export const WeaponContext = createContext<WeaponContextType | undefined>(undefined);

export const useWeapons = () => useContext(WeaponContext);