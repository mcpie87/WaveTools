'use client';

import { ReactNode, useState, useEffect } from 'react';

import { getStorageKey } from '@/utils/utils';
import { WeaponDBSchema, WeaponStateDBEntry } from '@/types/weaponTypes';
import { weaponSchema } from '@/schemas/weaponSchema';
import { WeaponContext } from '@/context/WeaponContext';

const STORAGE_KEY = getStorageKey('weapons');
// const VERSION_KEY = `${STORAGE_KEY}_2025-03-03T18:07`;

interface WeaponProviderProps {
  children: ReactNode;
}

export const WeaponProvider = ({ children }: WeaponProviderProps) => {
  const [weapons, setWeapons] = useState<WeaponDBSchema>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(weapons));
    }
  }, [weapons]);

  const updateWeapon = (id: string, data: WeaponStateDBEntry) => {
    const validationResult = weaponSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      return;
    }

    const arrToUpdate = weapons[id];
    if (!arrToUpdate) {
      setWeapons((prev) => ({
        ...prev,
        [id]: [data],
      }));
      return;
    }
    const updatedArr = [...arrToUpdate];
    updatedArr.push(data);
    setWeapons((prev) => ({
      ...prev,
      [id]: updatedArr,
    }));
  };

  const deleteWeapon = (id: string, index: number) => {
    setWeapons((prev) => {
      const weaponsArr = prev[id];
      if (!weaponsArr) {
        return prev;
      }

      const updatedWeaponsArr = [...weaponsArr];
      updatedWeaponsArr.splice(index, 1);

      return {
        ...prev,
        [id]: updatedWeaponsArr,
      }
    });
  }

  const updatePriority = (name: string, index: number, newPriority: number) => {
    // TODO: implement
    console.log(name, index, newPriority)
    return;
  }

  return (
    <WeaponContext.Provider value={{
      weapons,
      updateWeapon,
      deleteWeapon,
      updatePriority,
    }}>
      {children}
    </WeaponContext.Provider>
  );
};
