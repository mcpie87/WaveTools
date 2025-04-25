import { IItem } from "@/app/interfaces/item"
import ItemCard from "./items/ItemCard";
import React, { ChangeEvent, useRef, useState } from "react";
import { Input } from "./ui/input";

interface InputInventoryItemProps {
  item: IItem;
  value: number;
  setValue: (value: number) => void;
  displayedExtraRows?: 1 | 2; // 2 double drop is possible, 1 otherwise
  displayedRow1Value?: number;
}
export const InputInventoryItem = ({
  item,
  value,
  setValue,
  displayedExtraRows,
  displayedRow1Value,
}: InputInventoryItemProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefAddSub1 = useRef<HTMLInputElement>(null);
  const inputRefAddSub2 = useRef<HTMLInputElement>(null);

  const defaultValueRef = useRef(value);
  const [valueAddSub1, setValueAddSub1] = useState(displayedRow1Value ?? 0);
  const [valueAddSub2, setValueAddSub2] = useState(0);

  console.log("RENDER", value, valueAddSub1, valueAddSub2, defaultValueRef.current);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedInt = Number(e.target.value);
    if (parsedInt < 0) {
      setValue(0);
      return;
    }
    setValue(Math.max(0, parsedInt));
    setValueAddSub1(parsedInt - defaultValueRef.current);
    setValueAddSub2(0);
  }

  const handleAddOrSubtract = (idx: 1 | 2) => (e: ChangeEvent<HTMLInputElement>) => {
    const setter = idx === 1 ? setValueAddSub1 : setValueAddSub2;
    const parsedInt = Number(e.target.value);
    setter(parsedInt);
    setValue(defaultValueRef.current + parsedInt + (idx === 1 ? valueAddSub2 : valueAddSub1));
  };

  const inputOnClick = (ref: React.RefObject<HTMLInputElement> | null) => () => {
    if (ref === null) return;
    ref.current?.select();
  }

  return (
    <div className="flex flex-col w-[100px]">
      <ItemCard item={item} width={64} height={64} />
      {item.name}
      <Input
        id={item.name}
        value={Math.max(0, value)}
        ref={inputRef}
        onChange={handleChange}
        onClick={inputOnClick(inputRef as React.RefObject<HTMLInputElement>)}
        type="number"
      />
      {displayedExtraRows && displayedExtraRows > 0 && (
        <Input
          id={`${item.name}_1`}
          value={valueAddSub1}
          ref={inputRefAddSub1}
          onChange={handleAddOrSubtract(1)}
          onClick={inputOnClick(inputRefAddSub1 as React.RefObject<HTMLInputElement>)}
          type="number"
        />
      )}
      {displayedExtraRows && displayedExtraRows > 1 && (
        <Input
          id={`${item.name}_2`}
          value={valueAddSub2}
          ref={inputRefAddSub2}
          onChange={handleAddOrSubtract(2)}
          onClick={inputOnClick(inputRefAddSub2 as React.RefObject<HTMLInputElement>)}
          type="number"
        />
      )}
    </div>
  )
}