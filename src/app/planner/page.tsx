'use client'; // Mark as a Client Component in Next.js

import { AddResonatorForm } from '@/components/PlannerForm/AddResonatorForm';
import { ResonatorForm } from '@/components/PlannerForm/ResonatorForm';
import { resonatorSchema } from '@/schemas/resonatorSchema';
import { ResonatorStateDBEntry } from '@/types/resonatorTypes';
import { useState } from 'react';
import { PlannerDataComponent } from './components/PlannerDataComponent';
import { useCharacters } from '@/context/CharacterContext';
import { PlannerSummaryComponent } from './components/PlannerSummaryComponent';
import { useData } from '@/context/DataContext';
import { InventoryForm } from '@/components/PlannerForm/InventoryForm';
import { ItemStateDBSchema } from '@/types/itemTypes';
import { useItems } from '@/context/ItemContext';
import { ManagePriorityComponent } from '@/components/PlannerForm/ManagePriorityComponent';

export default function CharactersPage() {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showManagePriority, setShowManagePriority] = useState(false);
  const [selectedResonator, setSelectedResonator] = useState<ResonatorStateDBEntry | null>(null);

  const resonatorContext = useCharacters();
  const itemContext = useItems();
  const { data, error, loading } = useData();
  if (loading) return (<div>Loading...</div>);
  if (!data) return (<div>Data is not present</div>);
  if (error) return (<div>Error present: {error.message}</div>);
  if (!resonatorContext) return (<div>Resonator context does not exist</div>);
  if (!itemContext) return (<div>Item context does not exist</div>);
  const { characters } = resonatorContext;
  const { updateItems, items: dbItems } = itemContext;
  const { resonators, items } = data;
  const { updateCharacter } = resonatorContext;

  const handleResonatorSubmit = (data: ResonatorStateDBEntry) => {
    const parsedData = resonatorSchema.parse(data);
    updateCharacter(parsedData.name, parsedData);
    setShowEditForm(false);
  };

  const handleInventorySubmit = (data: ItemStateDBSchema) => {
    updateItems(data);
    setShowInventoryForm(false);
  }

  const handleAddResonator = (name: string) => {
    setSelectedResonator({
      ...resonatorSchema.parse({
        priority: Object.keys(characters).length
      }),
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
    <div className="flex flex-row justify-between">
      <div>
        <div className="flex flex-row gap-x-2">
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add character
          </button>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => setShowInventoryForm(!showInventoryForm)}
          >
            Show inventory
          </button>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => setShowManagePriority(!showManagePriority)}
          >
            Manage Priority
          </button>
        </div>
        {showEditForm && selectedResonator && (
          <ResonatorForm
            initialData={selectedResonator}
            onSubmit={handleResonatorSubmit}
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
        {showInventoryForm && (
          <InventoryForm
            showForm={showInventoryForm}
            onSubmit={handleInventorySubmit}
            initialFormData={dbItems}
            items={items}
            onClose={() => setShowInventoryForm(false)}
          />
        )}
        {showManagePriority && (
          <ManagePriorityComponent
            showForm={showManagePriority}
            resonators={characters}
            onClose={() => setShowManagePriority(false)}
          />
        )}
        <PlannerDataComponent
          characters={characters}
          resonators={resonators}
          items={items}
          onEditResonator={handleEditResonator}
        />
      </div>
      <div className="border w-[600px]">
        <div className="text-center">Summary</div>
        <PlannerSummaryComponent
          dbResonators={characters}
          apiResonators={resonators}
          apiItems={items}
        />
      </div>
    </div>
  );
}