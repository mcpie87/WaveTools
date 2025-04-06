import Image from 'next/image';
import { convertToUrl, getRarityClass } from '@/utils/utils';
import { IItem } from '@/app/interfaces/item';

interface ItemCardProps {
  item: IItem;
  width?: number;
  height?: number;
}
export default function ItemCard({ item, width, height }: ItemCardProps) {

  const formatValue = (value: number) => {
    if (value > 1e9) return `~${(value / 1e9).toFixed(2)}B`;
    if (value > 1e6) return `~${(value / 1e6).toFixed(2)}M`;
    if (value > 1e3) return `~${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  }

  return (
    <div className="flex flex-col border border-black">
      <span className={`card-image-container ${getRarityClass(item.rarity)}`}>
        <Image
          src={`${convertToUrl(item.icon)}`}
          alt={`${item.name} icon`}
          width={width || 48}
          height={height || 48}
          className={`rounded-lg w-[${width || 48}] h-[${height || 48}]`}
        />
      </span>
      <span className="text-center text-xs bg-black text-white">
        {item.value ? formatValue(item.value) : ""}
      </span>
    </div>
  );
}