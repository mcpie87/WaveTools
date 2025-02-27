import { createContext, useContext } from 'react';
import { ResonatorDBSchema, ResonatorStateDBEntry } from '../types/resonatorTypes';

type CharacterContextType = {
  characters: ResonatorDBSchema;
  updateCharacter: (id: string, data: ResonatorStateDBEntry) => void;
};

export const CharacterContext = createContext<CharacterContextType>({
  characters: {},
  updateCharacter: () => { },
});

export const useCharacters = () => useContext(CharacterContext);