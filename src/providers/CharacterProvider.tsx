'use client'; // Mark as a Client Component in Next.js

import { ReactNode, useState, useEffect } from 'react';
import { CharacterContext } from '../context/CharacterContext';
import { ResonatorDBSchema, ResonatorStateDBEntry } from '../types/resonatorTypes';
import { resonatorSchema } from '../schemas/resonatorSchema';

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [characters, setCharacters] = useState<ResonatorDBSchema>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('characters');
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('characters', JSON.stringify(characters));
    }
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

  return (
    <CharacterContext.Provider value={{ characters, updateCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};