import Image from 'next/image';
import { ASSET_URL } from '@/utils/constants';

export default function ItemCard({ item }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
      <Image
        src={`${ASSET_URL}${item.icon}`}
        alt={`${item.name} icon`}
        width={64}
        height={64}
        className="rounded-lg"
      />
      <div className="text-white font-bold mb-2">{item.id}</div>
      <div className="text-white text-lg">{item.name}</div>
    </div>
    // <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
    // <img src="https://via.placeholder.com/50" alt="Union EXP Icon" class="w-12 h-12 mb-4">
    // <p class="text-2xl font-bold mb-2">100</p>
    // <p class="text-lg">Union EXP</p>
// </div>
  );
}