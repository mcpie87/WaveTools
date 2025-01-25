'use client';

import { useEffect, useState } from 'react';

const elementMap = {
  1: 'Glacio',
  2: 'Fusion',
  3: 'Electro',
  4: 'Aero',
  5: 'Spectro',
  6: 'Havoc',
};


interface ICharacter {
  id: number;
  rarity: number;
  name: string;
  elementId: number;
  card: string;
  body: string;
  icon: {
    circle: string;
    large: string;
    big: string;
  },
  materials: {
    weekly: string,
    boss: string,
    specialty: string,
    common: string,
    talent: string,
  },
  talents: {
    normal_attack: string,
    resonance_skill: string,
    forte: string,
    resonance_liberation: string,
    intro: string,
    outro: string,
  }
}

export default function CharacterCard() {
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

  console.log("reached");

  if (!data) return <div>Loading...</div>;

  const CardList = ({ data }) => {
    console.log("rendering cardlist", data);
    return (
      <div>
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <h1 className="text-xl font-semibold">
                {item.name}
              </h1>
              <div className="text-gray-600">
                {item.rarity} - {elementMap[item.elementId]}
                <div>
                  <h2>Materials</h2>
                  <p className="text-gray-600">
                    Weekly: {item.materials.weekly}
                    Boss: {item.materials.boss}
                    Specialty: {item.materials.specialty}
                    Common: {item.materials.common}
                    Talent: {item.materials.talent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <h1 className="text-xl font-semibold">
          Character Name
        </h1>
        <p className="text-gray-600">
          Character Description
        </p>
      </div>
      <div>
        <CardList data={data} />
      </div>
    </div>
  );
}