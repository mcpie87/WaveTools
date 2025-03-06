'use client';

import { ReactNode, useState, useEffect } from 'react';
import { CharacterContext } from '../context/CharacterContext';
import { ResonatorDBSchema, ResonatorStateDBEntry } from '../types/resonatorTypes';
import { resonatorSchema } from '../schemas/resonatorSchema';
import LocalStorageService from '@/services/LocalStorageService';

const storageService = new LocalStorageService("resonators");
// const VERSION_KEY = `${STORAGE_KEY}_2025-03-03T18:07`;
// TODO: remove "characters" key for future migration

interface CharacterProviderProps {
  children: ReactNode;
}
export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  const [characters, setCharacters] = useState<ResonatorDBSchema>(() => {
    return storageService.load() as ResonatorDBSchema || {};
  });

  useEffect(() => {
    storageService.save(characters);
  }, [characters]);

  const updateCharacter = (id: string, data: ResonatorStateDBEntry) => {
    const validationResult = resonatorSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      return;
    }

    setCharacters((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  const deleteCharacter = (id: string) => {
    setCharacters((prev) => {
      const { [id]: _, ...rest } = prev;
      void _;
      return rest;
    });
  }

  const updatePriorities = (updatedWeapons: ResonatorStateDBEntry[]) => {
    setCharacters((prev) => {
      const newCharacters = { ...prev };
      for (const resonator of updatedWeapons) {
        newCharacters[resonator.name].priority = resonator.priority;
      }
      return newCharacters;
    });
  }

  return (
    <CharacterContext.Provider value={{
      characters,
      updateCharacter,
      deleteCharacter,
      updatePriorities
    }}>
      {children}
    </CharacterContext.Provider>
  );
};