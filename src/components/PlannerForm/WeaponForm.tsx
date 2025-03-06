'use client'; // Mark as a Client Component in Next.js

import { useForm } from 'react-hook-form';
import { levelSelectValues, nextLevel, prevLevel } from '../../types/resonatorTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { resonatorSchemaFieldsMinMaxValues } from '@/schemas/resonatorSchema';
import { InputNumber } from '../InputNumber';
import { Path } from 'react-hook-form';
import { ModalComponent } from './ModalComponent';
import { WeaponStateDBEntry } from '@/types/weaponTypes';
import { weaponSchema, weaponSchemaForForm } from '@/schemas/weaponSchema';

interface WeaponFormProps {
  initialData: WeaponStateDBEntry;
  onSubmit: (data: WeaponStateDBEntry) => void;
  showForm: boolean;
  onClose: () => void;
}
export const WeaponForm = ({
  initialData,
  showForm,
  onClose,
  onSubmit
}: WeaponFormProps) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm<WeaponStateDBEntry>({
    resolver: zodResolver(weaponSchema),
    defaultValues: initialData,
  });

  const handleSetValue = (fieldName: Path<WeaponStateDBEntry>, newValue: number | string) => {
    // TODO: this requires way more control
    if (fieldName === "level.current") {
      const current = watch("level.current");
      const desired = watch("level.desired");
      const currentInt = parseInt(current as string);
      const desiredInt = parseInt(desired as string);
      if (currentInt > desiredInt || (currentInt === desiredInt && typeof current === "string")) {
        // Selected current level is higher than desired, we have to update desired
        setValue("level.desired", newValue);
      }
    }
    setValue(fieldName, newValue);
  };

  const canIncrement = (field: weaponSchemaForForm, which: "current" | "desired") => {
    const max = resonatorSchemaFieldsMinMaxValues.level.max;
    const { current, desired } = watch(field);
    const currentInt = parseInt(current as string);
    const desiredInt = parseInt(desired as string);
    if (which === "desired") {
      return currentInt <= desiredInt && desiredInt < max;
    }
    if (typeof current !== "string" && typeof desired === "string") {
      return currentInt <= desiredInt;
    }
    return currentInt < desiredInt;
  }
  const canDecrement = (field: weaponSchemaForForm, which: "current" | "desired") => {
    const min = resonatorSchemaFieldsMinMaxValues.level.min;
    const { current, desired } = watch(field);
    const currentInt = parseInt(current as string);
    const desiredInt = parseInt(desired as string);
    if (which === "current") {
      return currentInt <= desiredInt && min < currentInt;
    }
    if (typeof current !== "string" && typeof desired === "string") {
      return currentInt <= desiredInt;
    }
    return currentInt < desiredInt;
  }

  return (
    <ModalComponent show={showForm} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-wrap w-1/2 text-sm">
        <div className="flex flex-col gap-10">
          <div className="text-center text-xl">{initialData.name}</div>
          <div className="flex flex-col flex-wrap">
            <div className="border">
              <div className="flex flex-col items-center justify-center">
                <h3>Level</h3>
                <div className="flex flex-row gap-5">
                  <InputNumber
                    value={watch("level.current")}
                    label={"Current"}
                    setValue={(newValue) => handleSetValue("level.current", newValue)}
                    disableDecrement={!canDecrement("level", "current")}
                    disableIncrement={!canIncrement("level", "current")}
                    prev={prevLevel}
                    next={nextLevel}
                    min={1}
                    max={watch("level.desired")}
                    values={levelSelectValues}
                  />
                  <InputNumber
                    value={watch("level.desired")}
                    label={"Desired"}
                    setValue={(newValue) => handleSetValue("level.desired", newValue)}
                    disableDecrement={!canDecrement("level", "desired")}
                    disableIncrement={!canIncrement("level", "desired")}
                    prev={prevLevel}
                    next={nextLevel}
                    min={watch("level.current")}
                    max={90}
                    values={levelSelectValues}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form>
    </ModalComponent>
  );
};