// context/PlannerFormContext.ts

import { IItem } from '@/app/interfaces/item';
import { createContext, useContext } from 'react';

export enum PlannerFormType {
  AddResonator,
  AddWeapon,
  EditResonator,
  EditWeapon,
  Inventory,
  ManagePriority,
  EditSelectedMaterials,
}

export interface PlannerFormContextType {
  form: PlannerFormType | null;
  selectedParams: Record<string, string>;
  setForm: (formType: PlannerFormType, params?: Record<string, string>) => void;
  clearForm: () => void;

  selectedItem: IItem | null;
  setSelectedItem: (item: IItem) => void;
}

const PlannerFormContext = createContext<PlannerFormContextType | undefined>(undefined);

export default PlannerFormContext;

export const usePlannerFormContext = () => {
  const context = useContext(PlannerFormContext);
  if (context === undefined) {
    console.warn("usePlannerFormContext used outside PlannerFormProvider; returning fallback");
    return {
      selectedItem: null,
      form: null,
      setSelectedItem: () => console.warn("setSelectedItem called without provider"),
      setForm: () => console.warn("setForm called without provider"),
      clearForm: () => console.warn("clearForm called without provider"),
    };
  }
  return context;
};