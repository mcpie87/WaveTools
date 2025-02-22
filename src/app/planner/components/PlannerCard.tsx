// import React, { useState, useMemo } from 'react';
// import CharacterCard from '@/components/characters/CharacterCard';
// import ItemList from '@/components/items/ItemList';
// import { useCharacters } from '../contexts/CharacterContext';
// import { useData } from '@/app/context/DataContext';
// import dataFind from '@/utils/DataSearcher';

// interface Material {
//   id: number;
//   name: string;
//   value: number;
// }
// interface Ascension {
//   rank: number;
//   max: number;
//   materials: Material[]
// }

// interface Item {
//   name: string;
//   rarity: string;
//   elementId: string;
//   materials: Ascension[];
// }

// interface PlannerCardProps {
//   index: number;
//   item: Item;
// }

// interface CalculatedMaterialsPre {
//   [key: string]: {
//     id: number;
//     value: string;
//   };
// };

// const mapCalculatedMaterials = (materials: CalculatedMaterialsPre, itemsData: object[]) => {
//   // console.log("map!", materials, itemsData);
//   const retData: object[] = [];
//   for (const [k, v] of Object.entries(materials)) {
//     retData.push({
//       id: v.id,
//       name: k,
//       value: v.value,
//       icon: dataFind(itemsData, "id", v.id)?.icon
//     })
//     // console.log("KVAL", k, v);
//   }
//   console.log("RETDATA", itemsData, retData);
//   return retData;
//   // console.log("PREV", materials, "AFTER", retData);
// }

// const calculateMaterials = (
//   currentAscension: number,
//   desiredAscension: number,
//   materials: Ascension[],
//   itemsData: object[]
// ) => {
//   const totalMaterials = {};
//   for (const ascension of materials) {
//     if (ascension.rank > currentAscension && ascension.rank <= desiredAscension) {
//       for (const material of ascension.materials) {
//         if (totalMaterials[material.name]) {
//           totalMaterials[material.name].value += material.value;
//         } else {
//           totalMaterials[material.name] = {
//             id: material.id,
//             value: material.value,
//           }
//         }
//       }
//     }
//   }

//   console.log("TOTAL MATS!",);

//   return mapCalculatedMaterials(
//     totalMaterials,
//     itemsData
//   );
// }

// const PlannerCard: React.FC<PlannerCardProps> = ({ index, item }) => {
//   const { characters, updateCharacter } = useCharacters();
//   const savedData = characters[item.name] || {};

//   const [currentLevel, setCurrentLevel] = useState<number>(savedData.currentLevel || 1);
//   const [desiredLevel, setDesiredLevel] = useState<number>(savedData.desiredLevel || 90);
//   const [currentAscension, setCurrentAscension] = useState<number>(savedData.currentAscension || 0);
//   const [desiredAscension, setDesiredAscension] = useState<number>(savedData.desiredAscension || 6);
//   const [currentNormalAttack, setCurrentNormalAttack] = useState<number>(savedData.currentNormalAttack || 1);
//   const [desiredNormalAttack, setDesiredNormalAttack] = useState<number>(savedData.desiredNormalAttack || 10);
//   const [currentResonanceSkill, setCurrentResonanceSkill] = useState<number>(savedData.currentResonanceSkill || 1);
//   const [desiredResonanceSkill, setDesiredResonanceSkill] = useState<number>(savedData.desiredResonanceSkill || 10);
//   const [currentForte, setCurrentForte] = useState<number>(savedData.currentForte || 1);
//   const [desiredForte, setDesiredForte] = useState<number>(savedData.desiredForte || 10);
//   const [currentResonanceLiberation, setCurrentResonanceLiberation] = useState<number>(savedData.currentResonanceLiberation || 1);
//   const [desiredResonanceLiberation, setDesiredResonanceLiberation] = useState<number>(savedData.desiredResonanceLiberation || 10);
//   const [currentIntro, setCurrentIntro] = useState<number>(savedData.currentIntro || 1);
//   const [desiredIntro, setDesiredIntro] = useState<number>(savedData.desiredIntro || 10);

//   const { data, loading } = useData();
//   const calculatedMaterials = useMemo(() => {
//     return calculateMaterials(
//       currentAscension,
//       desiredAscension,
//       item.materials,
//       data.items
//     );
//   }, [currentAscension, desiredAscension, item.materials, data.items]);
//   // console.log("Mats", item.name, calculatedMaterials)

//   if (loading) {
//     return (<div>Loading...</div>)
//   }
//   console.log("CHARACTERS DATA!", data.items)
//   console.log(dataFind(data.items, "name", "Basic Energy Core"));


//   const calculate = () => {
//     console.log('calculate!');
//     updateCharacter(item.name, {
//       currentLevel,
//       desiredLevel,
//       currentAscension,
//       desiredAscension,
//       currentNormalAttack,
//       desiredNormalAttack,
//       currentResonanceSkill,
//       desiredResonanceSkill,
//       currentForte,
//       desiredForte,
//       currentResonanceLiberation,
//       desiredResonanceLiberation,
//       currentIntro,
//       desiredIntro,
//     });
//   };

//   console.log("MATS!", calculatedMaterials);
//   return (
//     <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="p-4">
//         <h1 className="text-xl font-semibold">
//           {item.name}
//         </h1>
//         <div className="bg-blue-500">
//           <CharacterCard item={item} />
//           <div>
//             <div className="flex">
//               <h3>Current Level</h3>
//               <input
//                 id="currentLevel"
//                 type="number"
//                 min="1"
//                 max="90"
//                 value={currentLevel}
//                 onChange={(e) => setCurrentLevel(Number(e.target.value))}
//               />
//               <input
//                 id="desiredLevel"
//                 type="number"
//                 min="1"
//                 max="90"
//                 value={desiredLevel}
//                 onChange={(e) => setDesiredLevel(Number(e.target.value))}
//               />
//             </div>
//             <div className="flex">
//               <h3>Current Ascension</h3>
//               <input
//                 id="currentAscension"
//                 type="number"
//                 min="0"
//                 max="6"
//                 value={currentAscension}
//                 onChange={(e) => setCurrentAscension(Number(e.target.value))}
//               />
//               <input
//                 id="desiredAscension"
//                 type="number"
//                 min="0"
//                 max="6"
//                 value={desiredAscension}
//                 onChange={(e) => setDesiredAscension(Number(e.target.value))}
//               />
//             </div>
//             <div className="flex flex-col">
//               <h2>Talents</h2>
//               <div>
//                 <h3>Normal Attack</h3>
//                 <input
//                   id="currentNormalAttack"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={currentNormalAttack}
//                   onChange={(e) => setCurrentNormalAttack(Number(e.target.value))}
//                 />
//                 <input
//                   id="desiredNormalAttack"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={desiredNormalAttack}
//                   onChange={(e) => setDesiredNormalAttack(Number(e.target.value))}
//                 />
//               </div>
//               <div>
//                 <h3>Resonance Skill</h3>
//                 <input
//                   id="currentResonanceSkill"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={currentResonanceSkill}
//                   onChange={(e) => setCurrentResonanceSkill(Number(e.target.value))}
//                 />
//                 <input
//                   id="desiredResonanceSkill"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={desiredResonanceSkill}
//                   onChange={(e) => setDesiredResonanceSkill(Number(e.target.value))}
//                 />
//               </div>
//               <div>
//                 <h3>Forte</h3>
//                 <input
//                   id="currentForte"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={currentForte}
//                   onChange={(e) => setCurrentForte(Number(e.target.value))}
//                 />
//                 <input
//                   id="desiredForte"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={desiredForte}
//                   onChange={(e) => setDesiredForte(Number(e.target.value))}
//                 />
//               </div>
//               <div>
//                 <h3>Resonance Liberation</h3>
//                 <input
//                   id="currentResonanceLiberation"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={currentResonanceLiberation}
//                   onChange={(e) => setCurrentResonanceLiberation(Number(e.target.value))}
//                 />
//                 <input
//                   id="desiredResonanceLiberation"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={desiredResonanceLiberation}
//                   onChange={(e) => setDesiredResonanceLiberation(Number(e.target.value))}
//                 />
//               </div>
//               <div>
//                 <h3>Intro</h3>
//                 <input
//                   id="currentIntro"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={currentIntro}
//                   onChange={(e) => setCurrentIntro(Number(e.target.value))}
//                 />
//                 <input
//                   id="desiredIntro"
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={desiredIntro}
//                   onChange={(e) => setDesiredIntro(Number(e.target.value))}
//                 />
//               </div>
//               <button className="bg-yellow-200" onClick={calculate}>
//                 Calculate
//               </button>
//             </div>
//           </div>
//           <div>
//             <h2>Required Materials</h2>
//             <ul>
//               <ItemList data={calculatedMaterials} />
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// };
// export default PlannerCard;