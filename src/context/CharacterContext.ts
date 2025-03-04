import { createContext, useContext } from 'react';
import { ResonatorDBSchema, ResonatorStateDBEntry } from '../types/resonatorTypes';

type CharacterContextType = {
  characters: ResonatorDBSchema;
  updateCharacter: (id: string, data: ResonatorStateDBEntry) => void;
  deleteCharacter: (id: string) => void;
  updatePriority: (name: string, newPriority: number) => void;
};

export const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacters = () => useContext(CharacterContext);