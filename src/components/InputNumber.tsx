import { ChangeEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type InputNumber = number | string;
interface InputNumberProps {
  value: InputNumber;
  label: string;
  setValue: (newValue: InputNumber) => void;
  prev?: (val: InputNumber) => InputNumber;
  next?: (val: InputNumber) => InputNumber;
  values?: InputNumber[];
  disableDecrement: boolean;
  disableIncrement: boolean;
  min: InputNumber;
  max: InputNumber;
}

export const InputNumber = ({
  value,
  label,
  setValue,
  values,
  prev = (val: InputNumber) => (val as number - 1),
  next = (val: InputNumber) => (val as number + 1),
  disableDecrement,
  disableIncrement,
  min,
  max
}: InputNumberProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedInt = parseInt((e.target.value) as string);
    if (!parsedInt) {
      setValue(min);
      return;
    }
    if (parsedInt > (max as number)) {
      setValue(max);
      return;
    }
    if (parsedInt < (min as number)) {
      setValue(min);
      return;
    }
    setValue(parsedInt);
  }

  const inputOnClick = () => {
    inputRef.current?.select();
    if (values) {
      setDropdownOpen(!dropdownOpen);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h3>{label}</h3>
      <div className="relative inline-block text-left">
        <div className="flex">
          <Button
            onClick={() => setValue(prev(value))}
            type="button"
            className="border rounded-tl-full rounded-bl-full"
            disabled={disableDecrement}
          >
            -
          </Button>
          <Input
            ref={inputRef}
            onClick={inputOnClick}
            className="bg-static-base-light-100 text-static-text-primary text-center w-[50px]"
            value={value}
            onChange={handleChange}
          />
          <Button
            onClick={() => setValue(next(value))}
            type="button"
            className="border rounded-tr-full rounded-br-full"
            disabled={disableIncrement}
          >
            +
          </Button>
        </div>
        {values && dropdownOpen && (
          <div className="absolute flex flex-wrap mt-2 w-full bg-base-300 border rounded shadow-lg z-10">
            {values.map((lvl, idx) => {
              const fullWidth = idx === 0 || idx === values.length - 1;
              return (
                <div
                  key={lvl}
                  onClick={() => {
                    setValue(lvl);
                    setDropdownOpen(false);
                  }}
                  className={`border border-solid flex px-4 py-2 hover:bg-base-200 cursor-pointer ${fullWidth ? "w-full" : "w-1/2"}`}
                >
                  {lvl}
                </div>
              )
            }
            )}
          </div>
        )}
      </div>
    </div>
  );
};
