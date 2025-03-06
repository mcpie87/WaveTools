import Image from 'next/image';
import { convertToUrl, getRarityClass } from '@/utils/utils';
import { IItem } from '@/app/interfaces/item';

interface ItemCardProps {
  item: IItem
}
export default function ItemCard({ item }: ItemCardProps) {

  const formatValue = (value: number) => {
    if (value > 1e9) return `~${(value / 1e9).toFixed(3)}B`;
    if (value > 1e6) return `~${(value / 1e6).toFixed(3)}M`;
    if (value > 1e3) return `~${(value / 1e3).toFixed(3)}K`;
    return value.toString();
  }

  return (
    <div className="flex flex-col border border-black">
      <span className={`card-image-container ${getRarityClass(item.rarity)}`}>
        <Image
          src={`${convertToUrl(item.icon)}`}
          alt={`${item.name} icon`}
          width={48}
          height={48}
          className="rounded-lg"
        />
      </span>
      <span className="text-center text-xs bg-black text-white">
        {item.value ? formatValue(item.value) : ""}
      </span>
    </div>
  );
}