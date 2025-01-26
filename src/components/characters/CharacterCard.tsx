'use client';

import { useEffect, useState } from 'react';
// import { IItemCard, ItemCard } from '@/components/items/ItemCard';
import Image from 'next/image';
import { ASSET_URL } from '@/utils/constants';

export interface ICharacter {
  id: number,
  rarity: number,
  name: string,
  weaponType: {
    id: number,
    name: string,
    // icon: string,
  },
  element: {
    id: number,
    name: string,
    icon: string,
  },
  card: string,
  body: string,
  icon: {
    circle: string,
    large: string,
    big: string,
  },
  materials: any,
  // materials: {
  //   weekly: string,
  //   boss: string,
  //   specialty: string,
  //   common: string,
  //   talent: string,
  // },
  talents: {
    normal_attack: string,
    resonance_skill: string,
    forte: string,
    resonance_liberation: string,
    intro: string,
    outro: string,
  }
}

// export default function CharacterCard({ item }) {
//   return (
//     <div>
//       <Image src={`${ASSET_URL}${item.card}`} alt={`${item.name} icon`} width={256} height={256} />
//       <div>{item.rarity}</div>
//       <div>{item.name}</div>
//       <Image src={`${ASSET_URL}${item.element.icon}`} alt={`${item.element.name} icon`} width={38} height={38} />
//     </div>
//   );
// }

export default function CharacterCard({ item }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg shadow-xl space-y-4">
      <div className="relative">
        {/* Character Image */}
        <Image
          src={`${ASSET_URL}${item.card}`}
          alt={`${item.name} icon`}
          width={120}
          height={120}
          className="rounded-full border-4 border-gray-700"
        />

        {/* Element Icon */}
        <Image
          src={`${ASSET_URL}${item.element.icon}`}
          alt={`${item.element.name} icon`}
          width={40}
          height={40}
          className="absolute top-1 right-1"
        />

        {/* Rarity */}
        {/* <div className="absolute -bottom-2 mt-auto h-4 w-full">
          <div className="absolute bottom-0 h-4 w-full blur transition-all duration-200 group-hover:h-5 bg-yellow-500"></div>
          <div className="absolute bottom-0 h-2 w-full blur-sm duration-200 group-hover:h-3 bg-yellow-100"></div>
        </div> */}

        <div className="absolute bottom-0 w-full">
          <div className="relative flex w-full items-center">
            <div className="absolute -bottom-2 mt-auto h-4 w-full">
              <div className="absolute bottom-0 h-4 w-full blur transition-all duration-200 group-hover:h-5 bg-purple-500"></div>
              <div className="absolute bottom-0 h-2 w-full blur-sm duration-200 group-hover:h-3 bg-purple-100"></div>
            </div>
          </div>
        </div>
        <div className="h-[3px]" style={{ backgroundColor: "rgb(192, 132, 252)" }}></div>
      </div>

      {/* Character Name */}
      <div className="text-2xl font-bold text-white">{item.name}</div>
    </div>
  );
}