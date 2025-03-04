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
  const { updateCharacter, updatePriority } = resonatorContext;

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
    const resonator = resonators.find(entry => entry.name === name);

    setSelectedResonator({
      ...resonatorSchema.parse({
        id: resonator?.id,
        priority: Object.keys(characters).length,
        rarity: resonator?.rarity,
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
      <div className="border w-[350px] order-2 shrink-0">
        <PlannerSummaryComponent
          dbResonators={characters}
          apiResonators={resonators}
          apiItems={items}
        />
      </div>
      <div className="order-1">
        <div className="flex flex-row gap-x-2 justify-center">
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
            apiItems={items}
            onClose={() => setShowInventoryForm(false)}
          />
        )}
        {showManagePriority && (
          <ManagePriorityComponent
            showForm={showManagePriority}
            dbResonators={characters}
            apiResonators={resonators}
            onClose={() => setShowManagePriority(false)}
            onDragAndDrop={updatePriority}
          />
        )}
        <PlannerDataComponent
          characters={characters}
          resonators={resonators}
          apiItems={items}
          onEditResonator={handleEditResonator}
        />
      </div>
    </div>
  );
}