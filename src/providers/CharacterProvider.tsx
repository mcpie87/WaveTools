'use client';

import { ReactNode, useState, useEffect } from 'react';
import { CharacterContext } from '../context/CharacterContext';
import { ResonatorDBSchema, ResonatorStateDBEntry } from '../types/resonatorTypes';
import { resonatorSchema } from '../schemas/resonatorSchema';
import { getStorageKey } from '@/utils/utils';

interface CharacterProviderProps {
  children: ReactNode;
}
export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  const [characters, setCharacters] = useState<ResonatorDBSchema>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(getStorageKey('characters'));
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey('characters'), JSON.stringify(characters));
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

  return (
    <CharacterContext.Provider value={{ characters, updateCharacter, deleteCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};