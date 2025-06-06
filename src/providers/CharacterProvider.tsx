'use client';

import { ReactNode, useState } from 'react';
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
  const [characters, setCharacters] = useState<ResonatorDBSchema>(() =>
    storageService.load() as ResonatorDBSchema || {}
  );

  const updateCharacter = (id: string, data: ResonatorStateDBEntry) => {
    const validationResult = resonatorSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      return;
    }

    setCharacters((prev) => {
      const newState = { ...prev, [id]: data };
      storageService.save(newState);
      return newState;
    });
  };

  const deleteCharacter = (id: string) => {
    setCharacters((prev) => {
      const { [id]: _, ...rest } = prev;
      void _;
      storageService.save(rest);
      return rest;
    });
  }

  const updatePriorities = (updatedResonators: ResonatorStateDBEntry[]) => {
    setCharacters((prev) => {
      const newCharacters = { ...prev };
      for (const resonator of updatedResonators) {
        newCharacters[resonator.name].priority = resonator.priority;
      }
      storageService.save(newCharacters);
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