// 'use client'; // Mark as a Client Component in Next.js
// import 'leaflet/dist/leaflet.css';

// import React, { useEffect, useState } from 'react';
// import { MapContainer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

// const simpleCRS = L.CRS.Simple;

// const convertMarkerToCoord = (marker: APIMarker): IMarker => ({
//   x: marker.Transform[0].X / 10000,
//   y: -1 * marker.Transform[0].Y / 10000,
//   z: marker.Transform[0].Z / 10000,
//   name: marker.BlueprintType,
//   description: JSON.stringify(marker, null, 2),
// });
// const convertMarkersToCoords = (markers: APIMarker[]): IMarker[] => markers.map(convertMarkerToCoord);

// // const TranslationMap: Record<string, object> = {
// //   "Treasure034": {
// //     name: "Vault Undergrounds Shell Credit",
// //     rewardId: 1321,
// //   }
// // };

// interface APIMarker {
//   Transform: {
//     X: number;
//     Y: number;
//     Z: number;
//   }[];
//   BlueprintType: string;
//   MapId: number;
//   ComponentsData?: {
//     RewardComponent?: {
//       RewardId?: number;
//     }
//   }
// }

// interface IMarker {
//   x: number;
//   y: number;
//   z: number;
//   name: string;
//   description: string;
// }
export default function XYZMap() {
  //   const [data, setData] = useState<APIMarker[]>([]);
  //   const [visibleCategories, setVisibleCategories] = useState<Record<string, number | boolean>>({});
  //   useEffect(() => {
  //     async function fetchData() {
  //       const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  //       const dataResponse = await fetch(`${basePath}/data/levelentityconfig.json`);
  //       const data = await dataResponse.json();
  //       setData(data);
  //     }
  //     fetchData();
  //   }, [])

  //   if (!data) return (<div>Loading...</div>);
  //   const categories = [...new Set(data.map(e => e.BlueprintType))]
  //     .sort((a, b) => a.localeCompare(b));
  //   const markers = data
  //     .filter(entry => visibleCategories[entry.BlueprintType])
  //     .filter(entry => entry.ComponentsData?.RewardComponent?.RewardId === 1321)
  //   // .filter(entry => entry.MapId === 8);
  //   const displayedMarkers = convertMarkersToCoords(markers);

  //   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = event.target;
  //     console.log("handleCheckboxChange", name, value, event.target.checked);
  //     setVisibleCategories(prevState => ({
  //       ...prevState,
  //       [name]: event.target.checked
  //     }));
  //   }
  return (
    <div className="flex flex-row">
      test
      {/* //       <div>
//         {categories.map(category => (
//           <div key={category} className="flex flex-row">
//             <input type="checkbox" id={category} name={category} value={category} onChange={handleCheckboxChange} />
//             <h2>{category}</h2>
//           </div>
//         ))}
//       </div>
//       <MapContainer
//         crs={simpleCRS}
//         center={[0, 0]}
//         zoom={-10}
//         minZoom={-10}
//         maxZoom={10}
//         style={{ height: '1000px', width: '100%' }}
//         attributionControl={false}
//       >
//         {displayedMarkers.map((coord, index) => (
//           <Marker
//             key={index}
//             position={[coord.y, coord.x]}
//           >
//             <Popup>
//               <div>
//                 <strong>{coord.name}</strong><br />
//                 <pre>{coord.description}</pre>
//                 X: {coord.x}<br />
//                 Y: {coord.y}<br />
//                 Z: {coord.z}
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer> */}
    </div >
  );
};