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
import { InventoryDBSchema } from '@/types/inventoryTypes';
import { useItems } from '@/context/InventoryContext';
import { ManagePriorityComponent } from '@/components/PlannerForm/ManagePriorityComponent';
import { useWeapons } from '@/context/WeaponContext';
import { usePlanner } from '@/hooks/usePlanner';
import { weaponSchema } from '@/schemas/weaponSchema';
import { AddWeaponForm } from '@/components/PlannerForm/AddWeaponForm';
import { WeaponStateDBEntry } from '@/types/weaponTypes';
import { WeaponForm } from '@/components/PlannerForm/WeaponForm';
import { getPlannerDBSize, getPlannerItems } from '@/utils/planner_utils';
import { IResonatorPlanner, IWeaponPlanner } from '../interfaces/planner_item';

export default function CharactersPage() {
  const [showAddResonatorForm, setShowAddResonatorForm] = useState(false);
  const [showAddWeaponForm, setShowAddWeaponForm] = useState(false);
  const [showEditResonatorForm, setShowEditResonatorForm] = useState(false);
  const [showEditWeaponForm, setShowEditWeaponForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showManagePriority, setShowManagePriority] = useState(false);
  const [selectedResonator, setSelectedResonator] = useState<ResonatorStateDBEntry | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponStateDBEntry | null>(null);

  const resonatorContext = useCharacters();
  const itemContext = useItems();
  const weaponContext = useWeapons();
  const { updatePlannerPriority, deletePlannerItem } = usePlanner();
  const { data, error, loading } = useData();
  if (loading) return (<div>Loading...</div>);
  if (!data) return (<div>Data is not present</div>);
  if (error) return (<div>Error present: {error.message}</div>);
  const { weapons: apiWeapons, resonators, items } = data;
  const { updateItems, items: dbItems } = itemContext;
  const { updateWeapon, weapons: dbWeapons } = weaponContext;
  const { characters, updateCharacter } = resonatorContext;
  const plannerItems = getPlannerItems(characters, resonators, dbWeapons, apiWeapons, items);

  const handleResonatorSubmit = (data: ResonatorStateDBEntry) => {
    const parsedData = resonatorSchema.parse(data);
    updateCharacter(parsedData.name, parsedData);
    setShowEditResonatorForm(false);
  };

  const handleWeaponSubmit = (data: WeaponStateDBEntry) => {
    const parsedData = weaponSchema.parse(data);
    updateWeapon(parsedData.name, parsedData);
    setShowEditWeaponForm(false);
  };

  const handleInventorySubmit = (data: InventoryDBSchema) => {
    updateItems(data);
    setShowInventoryForm(false);
  }

  const handleAddResonator = (name: string) => {
    const resonator = resonators.find(entry => entry.name === name);

    setSelectedResonator({
      ...resonatorSchema.parse({
        id: resonator?.id,
        priority: getPlannerDBSize(characters, dbWeapons) + 1,
        rarity: resonator?.rarity,
      }),
      name
    });
    setShowAddResonatorForm(false);
    setShowEditResonatorForm(true);
  }

  const handleAddWeapon = (name: string) => {
    const weapon = apiWeapons.find(entry => entry.name === name);
    console.log("handleAddWeapon", weapon);
    setSelectedWeapon({
      ...weaponSchema.parse({
        id: weapon?.id,
        orderId: dbWeapons[name]?.length ?? 0,
        priority: getPlannerDBSize(characters, dbWeapons) + 1,
        rarity: weapon?.rarity,
      }),
      name
    });
    setShowAddWeaponForm(false);
    setShowEditWeaponForm(true);
  }

  const handleEditResonator = (resonator: ResonatorStateDBEntry) => {
    console.log("handleEditResonator", resonator);
    setSelectedResonator(resonator);
    setShowEditResonatorForm(true);
  }

  const handleEditWeapon = (weapon: WeaponStateDBEntry) => {
    console.log("handleEditWeapon", weapon);
    setSelectedWeapon(weapon);
    setShowEditWeaponForm(true);
  }

  const handleDeletePlannerItem = (plannerItem: IResonatorPlanner | IWeaponPlanner) => {
    console.log("handleDeletePlannerItem", plannerItem);
    deletePlannerItem(plannerItem);
  }

  return (
    <div className="flex flex-row justify-between">
      <div className="border w-[350px] order-2 shrink-0">
        <PlannerSummaryComponent
          plannerItems={plannerItems}
          apiItems={items}
        />
      </div>
      <div className="order-1 w-full m-2">
        <div className="flex flex-row gap-x-2 justify-center">
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => setShowAddResonatorForm(!showAddResonatorForm)}
          >
            Add character
          </button>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => setShowAddWeaponForm(!showAddWeaponForm)}
          >
            Add weapon
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
        {showEditResonatorForm && selectedResonator && (
          <ResonatorForm
            initialData={selectedResonator}
            onSubmit={handleResonatorSubmit}
            showForm={showEditResonatorForm}
            onClose={() => setShowEditResonatorForm(false)}
          />
        )}
        {showEditWeaponForm && selectedWeapon && (
          <WeaponForm
            initialData={selectedWeapon}
            onSubmit={handleWeaponSubmit}
            showForm={showEditWeaponForm}
            onClose={() => setShowEditWeaponForm(false)}
          />
        )}
        {showAddResonatorForm && (
          <AddResonatorForm
            showForm={showAddResonatorForm}
            onClose={() => setShowAddResonatorForm(false)}
            onAddResonator={handleAddResonator}
          />
        )}
        {showAddWeaponForm && (
          <AddWeaponForm
            showForm={showAddWeaponForm}
            onClose={() => setShowAddWeaponForm(false)}
            onAddWeapon={handleAddWeapon}
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
            plannerItems={plannerItems}
            onClose={() => setShowManagePriority(false)}
            onDragAndDrop={updatePlannerPriority}
          />
        )}
        <PlannerDataComponent
          plannerItems={plannerItems}
          apiItems={items}
          onEditResonator={handleEditResonator}
          onEditWeapon={handleEditWeapon}
          onDelete={handleDeletePlannerItem}
        />
      </div>
    </div>
  );
}