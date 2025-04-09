import Image from 'next/image';
import { convertToUrl } from '@/utils/utils';
import { IItem } from '@/app/interfaces/item';
import classNames from 'classnames';

interface ItemCardProps {
  item: IItem;
  overlay?: boolean;
  width?: number;
  height?: number;
}
export default function ItemCard({ item, width, height, overlay }: ItemCardProps) {
  const { rarity, value } = item;
  const formatValue = (value: number) => {
    if (value > 1e9) return `~${(value / 1e9).toFixed(2)}B`;
    if (value > 1e6) return `~${(value / 1e6).toFixed(2)}M`;
    if (value > 1e3) return `~${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  }

  return (
    <div className="flex flex-col bg-base-300 rounded-md">
      <div className="h-9 w-9 shrink-0 relative">
        <Image
          src={`${convertToUrl(item.icon)}`}
          alt={`${item.name} icon`}
          width={width || 48}
          height={height || 48}
          className="z-10 bg-transparent absolute inset-0"
        />
        {/* Rarity color fade */}
        <div
          className={classNames(
            "rounded-md absolute inset-0 bg-gradient-to-t via-transparent via-50% to-transparent",
            { "from-yellow-300/50": rarity === 5 },
            { "from-purple-600/50": rarity === 4 },
            { "from-blue-500/50": rarity === 3 },
            { "from-green-300/50": rarity === 2 },
            { "from-gray-400/50": rarity === 1 }
          )}
        />
        {/* Image quantity overlay */}
        {overlay && value && (
          <span className="absolute bottom-0 right-0 text-xs font-thin p-0.5 bg-black/70 rounded-br-md rounded-tl-md rounded-tr-md text-white z-10">
            {value}
          </span>
        )}

      </div>
      {!overlay && value && (
        <span className="text-center text-xs bg-black text-white">
          {item.value ? formatValue(item.value) : ""}
        </span>
      )}
      {/* <span className={`card-image-container ${getRarityClass(item.rarity)}`}>
        <Image
          src={`${convertToUrl(item.icon)}`}
          alt={`${item.name} icon`}
          width={width || 48}
          height={height || 48}
          className={`z-10 bg-transparent absolute inset-0 w-[${width || 48}] h-[${height || 48}]`}
        />
      </span>
      <span className="text-center text-xs bg-black text-white">
        {item.value ? formatValue(item.value) : ""}
      </span> */}
    </div>
  );
}