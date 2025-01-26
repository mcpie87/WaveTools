import { createContext, useContext, useState, useEffect } from 'react';

const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  console.log("char provider triggered", children.props);

  // Load saved data from local storage on initial render
  const [characters, setCharacters] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('characters');
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  // Save data to local storage whenever characters state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('characters', JSON.stringify(characters));
    }
  }, [characters]);

  const updateCharacter = (id, data) => {
    console.log("updateCharacter", id, data);
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

export const useCharacters = () => useContext(CharacterContext);