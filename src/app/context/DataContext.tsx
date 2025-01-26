import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const itemsResponse = await fetch('/data/items.json');
        const itemsDb = await itemsResponse.json();

        const resonatorResponse = await fetch('/data/resonator.json');
        const resonatorDb = await resonatorResponse.json();

        console.log("Fetching data");
        setData({
          items: itemsDb,
          resonators: resonatorDb,
        });
        console.log("Fetched data:", resonatorDb); // Log fetched data
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);