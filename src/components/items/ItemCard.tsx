import Image from 'next/image';
import { convertToUrl } from '@/utils/utils';
import { IItem } from '@/app/interfaces/item';
import classNames from 'classnames';
import { SYNTHESIS_ICON_URL } from '@/constants/constants';
import { FaCheck } from 'react-icons/fa';

interface ItemCardProps {
  item: IItem;
  overlay?: boolean;
  width?: number;
  height?: number;
}
export default function ItemCard({ item, width, height, overlay }: ItemCardProps) {
  const { rarity, value, converted, needed } = item;
  const formatValue = (value: number) => {
    let suffix = "";
    let displayedValue: number | string = value;
    if (value > 1e9) {
      suffix = "B";
      displayedValue = value / 1e9;
    } else if (value > 1e6) {
      suffix = "M";
      displayedValue = value / 1e6;
    } else if (value > 1e3) {
      suffix = "K";
      displayedValue = value / 1e3;
    }

    displayedValue = Number.isInteger(Number(displayedValue))
      ? displayedValue.toFixed(0)
      : displayedValue.toFixed(2);
    return `${displayedValue}${suffix}`;
  }

  return (
    <div className="flex flex-col bg-base-200 rounded-md relative">
      {/* Image with colors */}
      <div
        className={classNames(
          "relative",
          { "opacity-40": value === 0 || (converted !== undefined && value! === converted!) }
        )}
        style={{ width: `${width || 48}px`, height: `${height || 48}px` }}
      >
        <Image
          src={`${convertToUrl(item.icon)}`}
          alt={`${item.name} icon`}
          fill
          // width={width || 48}
          // height={height || 48}
          className="absolute inset-0 w-full h-full object-contain z-10"
        />
        {/* Rarity color fade */}
        <div
          className={classNames(
            "rounded-md absolute inset-0 bg-gradient-to-t via-transparent via-50% to-transparent fadeIn",
            { "from-yellow-300/50": rarity === 5 },
            { "from-purple-600/50": rarity === 4 },
            { "from-blue-500/50": rarity === 3 },
            { "from-green-300/50": rarity === 2 },
            { "from-gray-400/50": rarity === 1 }
          )}
        />
        {/* Image quantity overlay, used in Recipes */}
        {overlay && value !== undefined && (
          <span className="absolute bottom-0 right-0 text-xs font-thin p-0.5 bg-black/70 rounded-br-md rounded-tl-md rounded-tr-md text-white z-10">
            {value}
          </span>
        )}

        {/* Synthesis icon and converted value */}
        {!overlay && value !== undefined && converted !== undefined && (
          <span className="text-center text-xs bg-black text-white absolute flex flex-row top-1 left-1 z-30">
            <Image src={convertToUrl(SYNTHESIS_ICON_URL)} alt="synthesis icon" width={16} height={16} />
            {formatValue(converted)}
          </span>
        )}
        {/* Checkmark */}
        {!overlay && (value === 0 || (converted !== undefined && value === converted)) && (
          <span className="absolute w-full h-full text-green-500 text-3xl z-20 flex justify-center items-center">
            <FaCheck className="text-green-400 drop-shadow-[0_0_2px_black]" />
          </span>
        )}
      </div>
      {!overlay && needed !== undefined && (
        <span className="text-center text-xs bg-black text-white relative">
          {formatValue(needed)}
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