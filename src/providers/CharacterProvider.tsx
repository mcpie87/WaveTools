'use client';

import { ReactNode, useState, useEffect } from 'react';
import { CharacterContext } from '../context/CharacterContext';
import { ResonatorDBSchema, ResonatorStateDBEntry } from '../types/resonatorTypes';
import { resonatorSchema } from '../schemas/resonatorSchema';
import { getStorageKey } from '@/utils/utils';

const STORAGE_KEY = getStorageKey('resonators');
// const VERSION_KEY = `${STORAGE_KEY}_2025-03-03T18:07`;
// TODO: remove "characters" key for future migration

interface CharacterProviderProps {
  children: ReactNode;
}
export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  const [characters, setCharacters] = useState<ResonatorDBSchema>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }
  }, [characters]);

  const updateCharacter = (id: string, data: ResonatorStateDBEntry) => {
    if (!data.name) {
      data.name = id;
    }
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

  const updatePriority = (name: string, newPriority: number) => {
    const prevPriority = characters[name].priority;
    const prev = { ...characters };

    if (newPriority < prevPriority) {
      for (const key in prev) {
        if (newPriority <= prev[key].priority && prev[key].priority < prevPriority) {
          ++prev[key].priority;
        }
      }
    }

    if (newPriority > prevPriority) {
      for (const key in prev) {
        if (prevPriority < prev[key].priority && prev[key].priority <= newPriority) {
          --prev[key].priority;
        }
      }
    }

    prev[name].priority = newPriority;
    setCharacters(prev);
  }

  return (
    <CharacterContext.Provider value={{ characters, updateCharacter, deleteCharacter, updatePriority }}>
      {children}
    </CharacterContext.Provider>
  );
};