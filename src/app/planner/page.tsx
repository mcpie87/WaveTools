'use client'; // Mark as a Client Component in Next.js

import { AddResonatorForm } from '@/components/PlannerForm/AddResonatorForm';
import { ResonatorForm } from '@/components/PlannerForm/ResonatorForm';
import { resonatorSchema } from '@/schemas/resonatorSchema';
import { ResonatorStateDBEntry } from '@/types/resonatorTypes';
import { useState } from 'react';
import PlannerDataComponent from './components/PlannerDataComponent';
import { useCharacters } from '@/context/CharacterContext';

export default function CharactersPage() {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedResonator, setSelectedResonator] = useState<ResonatorStateDBEntry | null>(null);
  const resonatorContext = useCharacters();
  if (!resonatorContext) {
    return (<div>Resonator context does not exist</div>);
  }
  const { updateCharacter } = resonatorContext;
  const handleSubmit = (data: ResonatorStateDBEntry) => {
    console.log('Form submitted:', data);
    const parsedData = resonatorSchema.parse(data);
    updateCharacter(parsedData.name, parsedData);
    setShowEditForm(false);
  };

  const handleAddResonator = (name: string) => {
    setSelectedResonator({
      ...resonatorSchema.parse({}),
      name
    });
    setShowAddForm(false);
    setShowEditForm(true);
  }

  const handleEditResonator = (resonator: ResonatorStateDBEntry) => {
    console.log("handleEditResonator", resonator);
    setSelectedResonator(resonator);
    setShowEditForm(true);
  }


  return (
    <div>
      <div className="flex flex-row">
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add character
        </button>
      </div>
      {showEditForm && selectedResonator && (
        <ResonatorForm
          initialData={selectedResonator}
          onSubmit={handleSubmit}
          showForm={showEditForm}
          onClose={() => setShowEditForm(false)}
        />
      )}
      {showAddForm && (
        <AddResonatorForm
          showForm={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAddResonator={handleAddResonator}
        />
      )}
      <PlannerDataComponent onEditResonator={handleEditResonator} />
    </div>
  );
}