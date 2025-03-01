'use client'; // Mark as a Client Component in Next.js

import { useForm } from 'react-hook-form';
import { levelSelectValues, nextLevel, prevLevel, ResonatorStateDBEntry } from '../../types/resonatorTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveSkillNames, PassiveSkillNames, resonatorSchema, resonatorSchemaField, resonatorSchemaFieldsMinMaxValues } from '@/schemas/resonatorSchema';
import { InputNumber } from '../InputNumber';
import { Path } from 'react-hook-form';

interface ResonatorFormProps {
  initialData: ResonatorStateDBEntry;
  onSubmit: (data: ResonatorStateDBEntry) => void;
}
export const ResonatorForm = ({ initialData, onSubmit }: ResonatorFormProps) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ResonatorStateDBEntry>({
    resolver: zodResolver(resonatorSchema),
    defaultValues: initialData,
  });
  console.log("RENDER!", initialData);
  // validate: (v) => v >= 1 && v <= 90 || "Current level must be between 1 and 90"
  const onSubmitTmp = async (data: ResonatorStateDBEntry) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // reset();
    onSubmit(data);
  };
  console.log("Errors", errors);

  const handleSetValue = (fieldName: Path<ResonatorStateDBEntry>, newValue: number | string) => {
    setValue(fieldName, newValue);
  };

  const canIncrement = (field: resonatorSchemaField, which: "current" | "desired") => {
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
  const canDecrement = (field: resonatorSchemaField, which: "current" | "desired") => {
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
    <form onSubmit={handleSubmit(onSubmitTmp)} className="flex flex-col w-[200px]">
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
      <div>-----------------</div>
      {Object.entries(ActiveSkillNames).map(([skillKey, skillValue]) => {
        const typedSkillKey = skillKey as resonatorSchemaField;
        const currentSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.current`;
        const desiredSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.desired`;
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
      <div>-----------------</div>
      {Object.entries(PassiveSkillNames).map(([skillKey, skillValue]) => {
        const typedSkillKey = skillKey as resonatorSchemaField;
        const currentSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.current`;
        const desiredSkillKey: Path<ResonatorStateDBEntry> = `${typedSkillKey}.desired`;
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
      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
        disabled={isSubmitting}
      >
        Submit
      </button>
    </form>
    // <form onSubmit={handleSubmit(handleFormSubmit)}>
    //   <h2>Resonator Form</h2>

    //   {/* Level */}
    //   <InputField
    //     label="Level (Current)"
    //     name="level.current"
    //     value={initialData?.level.current || 1}
    //     onChange={(e) => register('level.current').onChange(e)}
    //     onBlur={(e) => register('level.current').onBlur(e)}
    //     error={errors.level?.current?.message}
    //     min={1}
    //     max={90}
    //   />
    //   <InputField
    //     label="Level (Desired)"
    //     name="level.desired"
    //     value={initialData?.level.desired || 1}
    //     onChange={(e) => register('level.desired').onChange(e)}
    //     onBlur={(e) => register('level.desired').onBlur(e)}
    //     error={errors.level?.desired?.message}
    //     min={1}
    //     max={90}
    //   />

    //   {/* Ascension */}
    //   <InputField
    //     label="Ascension (Current)"
    //     name="ascension.current"
    //     value={initialData?.ascension.current || 1}
    //     onChange={(e) => register('ascension.current').onChange(e)}
    //     onBlur={(e) => register('ascension.current').onBlur(e)}
    //     error={errors.ascension?.current?.message}
    //     min={1}
    //     max={6}
    //   />
    //   <InputField
    //     label="Ascension (Desired)"
    //     name="ascension.desired"
    //     value={initialData?.ascension.desired || 1}
    //     onChange={(e) => register('ascension.desired').onChange(e)}
    //     onBlur={(e) => register('ascension.desired').onBlur(e)}
    //     error={errors.ascension?.desired?.message}
    //     min={1}
    //     max={6}
    //   />

    //   {/* Active Skills */}
    //   {ACTIVE_SKILL_NAMES.map((skill) => (
    //     <div key={skill}>
    //       <h3>{skill}</h3>
    //       <InputField
    //         label={`${skill} (Current)`}
    //         name={`${skill}.current`}
    //         value={initialData?.[skill]?.current || 1}
    //         onChange={(e) => register(`${skill}.current`).onChange(e)}
    //         onBlur={(e) => register(`${skill}.current`).onBlur(e)}
    //         error={errors[skill]?.current?.message}
    //         min={1}
    //         max={10}
    //       />
    //       <InputField
    //         label={`${skill} (Desired)`}
    //         name={`${skill}.desired`}
    //         value={initialData?.[skill]?.desired || 1}
    //         onChange={(e) => register(`${skill}.desired`).onChange(e)}
    //         onBlur={(e) => register(`${skill}.desired`).onBlur(e)}
    //         error={errors[skill]?.desired?.message}
    //         min={1}
    //         max={10}
    //       />
    //     </div>
    //   ))}

    //   {/* Passive Skills */}
    //   {PASSIVE_SKILL_NAMES.map((skill) => (
    //     <div key={skill}>
    //       <h3>{skill}</h3>
    //       <InputField
    //         label={`${skill} (Current)`}
    //         name={`${skill}.current`}
    //         value={initialData?.[skill]?.current || 0}
    //         onChange={(e) => register(`${skill}.current`).onChange(e)}
    //         onBlur={(e) => register(`${skill}.current`).onBlur(e)}
    //         error={errors[skill]?.current?.message}
    //         min={0}
    //         max={2}
    //       />
    //       <InputField
    //         label={`${skill} (Desired)`}
    //         name={`${skill}.desired`}
    //         value={initialData?.[skill]?.desired || 0}
    //         onChange={(e) => register(`${skill}.desired`).onChange(e)}
    //         onBlur={(e) => register(`${skill}.desired`).onBlur(e)}
    //         error={errors[skill]?.desired?.message}
    //         min={0}
    //         max={2}
    //       />
    //     </div>
    //   ))}

    //   <button type="submit">Submit</button>
    // </form>
  );
};