'use client'; // Mark as a Client Component in Next.js

import { useForm } from 'react-hook-form';
import { levelSelectValues, nextLevel, prevLevel, ResonatorStateDBEntry } from '../../types/resonatorTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveSkillNames, PassiveSkillNames, resonatorSchema, resonatorSchemaFieldsMinMaxValues, resonatorSchemaForForm } from '@/schemas/resonatorSchema';
import { InputNumber } from '../InputNumber';
import { Path } from 'react-hook-form';
import { ModalComponent } from './ModalComponent';
import { Button } from '../ui/button';

interface ResonatorFormProps {
  initialData: ResonatorStateDBEntry;
  onSubmit: (data: ResonatorStateDBEntry) => void;
  onClose: () => void;
}
export const ResonatorForm = ({
  initialData,
  onClose,
  onSubmit
}: ResonatorFormProps) => {
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
    <ModalComponent show={true} onClose={onClose}>
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
            <div className="flex flex-row justify-center gap-10">
              <div className="border">
                <div className="text-center text-xl">
                  Active Talents
                </div>
                {Object.entries(ActiveSkillNames).map(([skillKey, skillValue]) => {
                  const typedSkillKey = skillKey as resonatorSchemaForForm;
                  const currentSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.current`;
                  const desiredSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.desired`;
                  return (
                    <div key={skillKey} className="flex flex-col items-center justify-center">
                      <h3>{skillValue}</h3>
                      <div className="flex flex-row gap-5">
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
                <div className="text-center text-xl">
                  Passive Talents
                </div>
                {Object.entries(PassiveSkillNames).map(([skillKey, skillValue]) => {
                  const typedSkillKey = skillKey as resonatorSchemaForForm;
                  const currentSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.current`;
                  const desiredSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.desired`;
                  return (
                    <div key={skillKey} className="flex flex-col items-center justify-center">
                      <h3>{skillValue}</h3>
                      <div className="flex flex-row gap-5">
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
            </div>
          </div>
          <Button
            type="submit"
            className="py-2 rounded"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </ModalComponent>
  );
};