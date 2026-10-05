// context/PlannerFormProvider.tsx

import { useState, ReactNode } from 'react';
import PlannerFormContext from '@/context/PlannerFormContext';
import { PlannerFormContextType } from '@/context/PlannerFormContext';
import { IItem } from '@/app/interfaces/item';

export const PlannerFormProvider = ({ children }: { children: ReactNode }) => {
  const [form, setFormState] = useState<PlannerFormContextType['form']>(null);
  const [selectedParams, setSelectedParams] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);

  // Function to update the form and parameters
  const setForm = (formType: PlannerFormContextType['form'], params: Record<string, string> = {}) => {
    setFormState(formType);
    setSelectedParams(params);
  };

  // Function to clear the form
  const clearForm = () => {
    setFormState(null);
    setSelectedParams({});
  };

  return (
    <PlannerFormContext.Provider value={{
      form,
      selectedParams,
      setForm,
      clearForm,
      selectedItem,
      setSelectedItem,
    }}>
      {children}
    </PlannerFormContext.Provider>
  );
};
