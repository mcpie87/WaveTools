'use client';

import { ReactNode, useState, useEffect } from 'react';
import { WeaponDBSchema, WeaponStateDBEntry } from '@/types/weaponTypes';
import { weaponSchema } from '@/schemas/weaponSchema';
import { WeaponContext } from '@/context/WeaponContext';
import LocalStorageService from '@/services/LocalStorageService';

// const VERSION_KEY = `${STORAGE_KEY}_2025-03-03T18:07`;

const storageService = new LocalStorageService("weapons");

interface WeaponProviderProps {
  children: ReactNode;
}

export const WeaponProvider = ({ children }: WeaponProviderProps) => {
  const [weapons, setWeapons] = useState<WeaponDBSchema>(() => {
    return storageService.load() as WeaponDBSchema || {};
  });

  useEffect(() => {
    storageService.save(weapons);
  }, [weapons]);

  const updateWeapon = (id: string, data: WeaponStateDBEntry) => {
    const validationResult = weaponSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error, data);
      return;
    }

    const arrToUpdate = weapons[id];
    if (!arrToUpdate) {
      setWeapons((prev) => {
        return ({
          ...prev,
          [id]: [data],
        })
      });
      return;
    }
    const updatedArr = [...arrToUpdate];
    if (data.orderId > updatedArr.length) {
      // addition
      updatedArr.push(data);
    } else {
      // edit
      updatedArr[data.orderId] = data;
    }
    // force reorder on items
    for (let i = 0; i < updatedArr.length; ++i) {
      updatedArr[i].orderId = i;
    }

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
      for (let i = 0; i < updatedWeaponsArr.length; ++i) {
        updatedWeaponsArr[i].orderId = i;
      }

      if (updatedWeaponsArr.length === 0) {
        const { [id]: _, ...rest } = prev;
        void _;
        return rest;
      }
      return {
        ...prev,
        [id]: updatedWeaponsArr,
      }
    });
  }

  const updatePriorities = (updatedWeapons: WeaponStateDBEntry[]) => {
    setWeapons((prev) => {
      const newWeapons = { ...prev };
      for (const weapon of updatedWeapons) {
        newWeapons[weapon.name][weapon.orderId].priority = weapon.priority;
      }
      return newWeapons;
    });
  }

  return (
    <WeaponContext.Provider value={{
      weapons,
      updateWeapon,
      deleteWeapon,
      updatePriorities,
    }}>
      {children}
    </WeaponContext.Provider>
  );
};
