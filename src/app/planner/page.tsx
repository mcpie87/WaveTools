'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import CharacterCard, { ICharacter } from "@/components/characters/CharacterCard";
import PlannerCard from "./components/PlannerCard";
import { CharacterProvider } from "./contexts/CharacterContext";

export default function Planner() {
  const [data, setData] = useState<ICharacter[] | null>(null);
  useEffect(() => {
    // Fetch JSON data from the public folder
    fetch('/data/resonator.json')
      .then((response) => response.json())
      .then((jsonData) => {
        console.log("data", jsonData);
        return setData(jsonData);
      })
      .catch((error) => console.error('Error loading JSON:', error));
  }, []);
  
  const PlannerCardList = ({ data }) => {
    if (!data) return <div>Loading...</div>;

    return (
      <div className="flex flex-row flex-wrap">
        {data.map((item, index) => (
          <PlannerCard key={index} index={index} item={item} />
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <CharacterProvider>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h1 className="text-xl font-semibold">
              Your characters
            </h1>
          </div>
          <div>
            <PlannerCardList data={data} />
          </div>
        </div>
      </CharacterProvider>
    </Layout>
  );
}