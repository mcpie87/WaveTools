import Image from 'next/image';
import { ASSET_URL } from '@/utils/constants';

export interface IItemCard {
  id: number,
  name: string,
  icon: string,
  value: string | null,
}

interface ItemCardProps {
  item: IItemCard;
}

export default function ItemCard({ item }: ItemCardProps) {
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
      <div className="text-white text-lg">{item.name} - {item.value}</div>
    </div>
  );
}