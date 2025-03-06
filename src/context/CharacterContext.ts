import { createContext, useContext } from 'react';
import { ResonatorDBSchema, ResonatorStateDBEntry } from '../types/resonatorTypes';

type CharacterContextType = {
  characters: ResonatorDBSchema;
  updateCharacter: (id: string, data: ResonatorStateDBEntry) => void;
  deleteCharacter: (id: string) => void;
  updatePriorities: (newResonators: ResonatorStateDBEntry[]) => void;
};

export const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacters = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("Character context not found");
  }
  return context;
}