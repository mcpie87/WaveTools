import Image from 'next/image';
import './ItemCard.css';
import { convertToUrl } from '@/utils/utils';
import { IItem } from '@/app/interfaces/item';

interface ItemCardProps {
  item: IItem
}
export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="card-container">
      <span className="card-wrapper">
        <span className="card-body">
          <span className="card-image-container card-rarity-4">
            <Image
              src={`${convertToUrl(item.icon)}`}
              alt={`${item.name} icon`}
              width={64}
              height={64}
              className="rounded-lg"
            />
          </span>
          <span className="card-text card-font">{item.value}</span>
        </span>
      </span>
    </div>
  );
}