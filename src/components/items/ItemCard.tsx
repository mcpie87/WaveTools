import Image from 'next/image';
import './ItemCard.css';
import { convertToUrl, getRarityClass } from '@/utils/utils';
import { IItem } from '@/app/interfaces/item';

interface ItemCardProps {
  item: IItem
}
export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="flex flex-col border border-black">
      <span className={`card-image-container ${getRarityClass(item.rarity)}`}>
        <Image
          src={`${convertToUrl(item.icon)}`}
          alt={`${item.name} icon`}
          width={64}
          height={64}
          className="rounded-lg"
        />
      </span>
      <span className="text-center text-xs bg-black text-white">{item.value}</span>
    </div>
  );
}