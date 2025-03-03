import { IItem } from "@/app/interfaces/item"
import ItemCard from "./items/ItemCard";
import { ChangeEvent, useRef } from "react";

interface InputInventoryItemProps {
  item: IItem;
  value: number;
  setValue: (value: number) => void;
}
export const InputInventoryItem = ({
  item,
  value,
  setValue,
}: InputInventoryItemProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedInt = parseInt((e.target.value) as string);
    if (!parsedInt) {
      setValue(0);
      return;
    }
    if (parsedInt < 0) {
      setValue(0);
      return;
    }
    setValue(parsedInt);
  }

  const inputOnClick = () => {
    inputRef.current?.select();
  }

  return (
    <div className="flex flex-col w-[100px]">
      <ItemCard item={item} />
      {item.name}
      <input
        id={item.name}
        value={value}
        ref={inputRef}
        onChange={handleChange}
        onClick={inputOnClick}
        type="number"
      />
    </div>
  )
}