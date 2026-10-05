// import { useEffect, useState } from "react";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (updatedData: Record<string, number>) => void;
// }

// export default function Modal({ isOpen, onClose, onSubmit, formData }: ModalProps) {
//   const [formState, setFormState] = useState<Record<string, number>>(formData);

//   useEffect(() => {
//     if (isOpen) document.body.classList.add("overflow-hidden");
//     else document.body.classList.remove("overflow-hidden");
//   }, [isOpen]);

//   if (!isOpen) return null;

//   function handleSubmit(event: React.FormEvent) {
//     event.preventDefault();
//     const formData = new FormData(event.target as HTMLFormElement);
//     const inputValue = formData.get("inputField") as string;
//     onSubmit(inputValue);
//     onClose();
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-semibold mb-4">Enter Data</h2>
//         <form onSubmit={handleSubmit}>
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
//             </div>
//             <div className="flex justify-end gap-2">
//               <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
//                 Cancel
//               </button>
//               <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
//                 Submit
//               </button>
//             </div>
//         </form>
//       </div>
//     </div>
//   );
// }