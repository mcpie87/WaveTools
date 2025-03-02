'use client'; // Mark as a Client Component in Next.js

import { useForm } from 'react-hook-form';
import { levelSelectValues, nextLevel, prevLevel, ResonatorStateDBEntry, ResonatorStateDBEntryWithoutName } from '../../types/resonatorTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveSkillNames, PassiveSkillNames, resonatorSchema, resonatorSchemaFieldsMinMaxValues, resonatorSchemaForForm } from '@/schemas/resonatorSchema';
import { InputNumber } from '../InputNumber';
import { Path } from 'react-hook-form';

interface ResonatorFormProps {
  initialData: ResonatorStateDBEntry;
  onSubmit: (data: ResonatorStateDBEntry) => void;
}
export const ResonatorForm = ({ initialData, onSubmit }: ResonatorFormProps) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm<ResonatorStateDBEntry>({
    resolver: zodResolver(resonatorSchema),
    defaultValues: initialData,
  });

  const handleSetValue = (fieldName: Path<ResonatorStateDBEntry>, newValue: number | string) => {
    setValue(fieldName, newValue);
  };

  const canIncrement = (field: resonatorSchemaForForm, which: "current" | "desired") => {
    const max = resonatorSchemaFieldsMinMaxValues[field].max;
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
  const canDecrement = (field: resonatorSchemaForForm, which: "current" | "desired") => {
    const min = resonatorSchemaFieldsMinMaxValues[field].min;
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-wrap h-[600px] text-sm">
      <div className="border">
        <div className="flex flex-col items-center justify-center">
          <h3>Current Level</h3>
          <div className="flex flex-row">
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
      <div className="border">
        {Object.entries(ActiveSkillNames).map(([skillKey, skillValue]) => {
          const typedSkillKey = skillKey as resonatorSchemaForForm;
          const currentSkillKey: Path<ResonatorStateDBEntryWithoutName> = `${typedSkillKey}.current`;
          const desiredSkillKey: Path<ResonatorStateDBEntryWithoutName> = `${typedSkillKey}.desired`;
          return (
            <div key={skillKey} className="flex flex-col items-center justify-center">
              <h3>{skillValue}</h3>
              <div className="flex flex-row">
                <InputNumber
                  value={watch(currentSkillKey)}
                  label={"Current"}
                  setValue={(newValue) => handleSetValue(currentSkillKey, newValue)}
                  disableDecrement={!canDecrement(typedSkillKey, "current")}
                  disableIncrement={!canIncrement(typedSkillKey, "current")}
                  min={1}
                  max={watch(desiredSkillKey)}
                />
                <InputNumber
                  value={watch(desiredSkillKey)}
                  label={"Desired"}
                  setValue={(newValue) => handleSetValue(desiredSkillKey, newValue)}
                  disableDecrement={!canDecrement(typedSkillKey, "desired")}
                  disableIncrement={!canIncrement(typedSkillKey, "desired")}
                  min={watch(currentSkillKey)}
                  max={10}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="border">
        {Object.entries(PassiveSkillNames).map(([skillKey, skillValue]) => {
          const typedSkillKey = skillKey as resonatorSchemaForForm;
          const currentSkillKey: Path<ResonatorStateDBEntryWithoutName> = `${typedSkillKey}.current`;
          const desiredSkillKey: Path<ResonatorStateDBEntryWithoutName> = `${typedSkillKey}.desired`;
          return (
            <div key={skillKey} className="flex flex-col items-center justify-center">
              <h3>{skillValue}</h3>
              <div className="flex flex-row">
                <InputNumber
                  value={watch(currentSkillKey)}
                  label={"Current"}
                  setValue={(newValue) => handleSetValue(currentSkillKey, newValue)}
                  disableDecrement={!canDecrement(typedSkillKey, "current")}
                  disableIncrement={!canIncrement(typedSkillKey, "current")}
                  min={0}
                  max={watch(desiredSkillKey)}
                />
                <InputNumber
                  value={watch(desiredSkillKey)}
                  label={"Desired"}
                  setValue={(newValue) => handleSetValue(desiredSkillKey, newValue)}
                  disableDecrement={!canDecrement(typedSkillKey, "desired")}
                  disableIncrement={!canIncrement(typedSkillKey, "desired")}
                  min={watch(currentSkillKey)}
                  max={2}
                />
              </div>
            </div>
          )
        })}
      </div>
      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
        disabled={isSubmitting}
      >
        Submit
      </button>
    </form>
  );
};