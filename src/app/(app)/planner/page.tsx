'use client';

import { AddResonatorForm } from '@/components/PlannerForm/AddResonatorForm';
import { ResonatorForm } from '@/components/PlannerForm/ResonatorForm';
import { resonatorSchema } from '@/schemas/resonatorSchema';
import { ResonatorStateDBEntry } from '@/types/resonatorTypes';
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
import { Button } from '@/components/ui/button';
import { PlannerFormProvider } from '@/providers/PlannerFormProvider';
import { PlannerFormType, usePlannerFormContext } from '@/context/PlannerFormContext';
import { useState } from 'react';
import { EditSelectedMaterialsForm } from '@/components/PlannerForm/EditMaterialsForm';
import { Toggle } from '@/components/ui/toggle';

const CharactersPage = () => {
  const [selectedResonator, setSelectedResonator] = useState<ResonatorStateDBEntry | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponStateDBEntry | null>(null);
  const [showInactiveItems, setShowInactiveItems] = useState(false);

  const { form, setForm, clearForm } = usePlannerFormContext();
  const { updateWeapon, weapons: dbWeapons } = useWeapons();
  const { updateItems, items: dbItems } = useItems();
  const { characters, updateCharacter } = useCharacters();
  const { updatePlannerPriority, deletePlannerItem, toggleActive } = usePlanner(); // TODO: rename or modify
  const { data, error, loading } = useData();
  if (loading) return (<div>Loading...</div>);
  if (!data) return (<div>Data is not present</div>);
  if (error) return (<div>Error present: {error.message}</div>);
  const { weapons: apiWeapons, resonators, items } = data;
  const plannerItems = getPlannerItems(characters, resonators, dbWeapons, apiWeapons, items)
    .filter(item => showInactiveItems ? true : item.dbData.isActive);

  const handleResonatorSubmit = (data: ResonatorStateDBEntry) => {
    const parsedData = resonatorSchema.parse(data);
    updateCharacter(parsedData.name, parsedData);
    clearForm();
  };

  const handleWeaponSubmit = (data: WeaponStateDBEntry) => {
    const parsedData = weaponSchema.parse(data);
    updateWeapon(parsedData.name, parsedData);
    clearForm();
  };

  const handleInventorySubmit = (data: InventoryDBSchema) => {
    updateItems(data);
    clearForm();
  }

  const handleEditSelectedMaterials = (data: InventoryDBSchema) => {
    console.log("handleEditSelectedMaterials");
    // TODO: maybe merge it with inventory submit?
    updateItems(data);
    clearForm();
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
    setForm(PlannerFormType.EditResonator);
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
    setForm(PlannerFormType.EditWeapon);
  }

  const handleEditResonator = (resonator: ResonatorStateDBEntry) => {
    console.log("handleEditResonator", resonator);
    setSelectedResonator(resonator);
    setForm(PlannerFormType.EditResonator);
  }

  const handleEditWeapon = (weapon: WeaponStateDBEntry) => {
    console.log("handleEditWeapon", weapon);
    setSelectedWeapon(weapon);
    setForm(PlannerFormType.EditWeapon);
  }

  const handleToggleActive = (plannerItem: IResonatorPlanner | IWeaponPlanner) => {
    console.log("handleToggleActive", plannerItem);
    toggleActive(plannerItem);
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
          inventory={dbItems}
          apiItems={items}
        />
      </div>
      <div className="order-1 w-full m-2 flex flex-col gap-2">
        {/* Top Buttons */}
        <div className="flex flex-row gap-x-2 justify-center">
          <Button
            onClick={() => setForm(PlannerFormType.AddResonator)}
            aria-label="Add a new resonator"
          >
            Add resonator
          </Button>
          <Button
            onClick={() => setForm(PlannerFormType.AddWeapon)}
            aria-label="Add a new weapon"
          >
            Add weapon
          </Button>
          <Button
            onClick={() => setForm(PlannerFormType.Inventory)}
            aria-label="Show inventory"
          >
            Show inventory
          </Button>
          <Button
            onClick={() => setForm(PlannerFormType.ManagePriority)}
            aria-label="Manage Priority"
          >
            Manage Priority
          </Button>
          <Toggle
            pressed={showInactiveItems}
            onPressedChange={() => setShowInactiveItems(!showInactiveItems)}
          >
            Display inactive items
          </Toggle>
        </div>
        {form === PlannerFormType.EditResonator && selectedResonator && (
          <ResonatorForm
            initialData={selectedResonator}
            onSubmit={handleResonatorSubmit}
            onClose={clearForm}
          />
        )}
        {form === PlannerFormType.EditWeapon && selectedWeapon && (
          <WeaponForm
            initialData={selectedWeapon}
            onSubmit={handleWeaponSubmit}
            onClose={clearForm}
          />
        )}
        {form === PlannerFormType.AddResonator && (
          <AddResonatorForm
            onClose={clearForm}
            onAddResonator={handleAddResonator}
          />
        )}
        {form === PlannerFormType.AddWeapon && (
          <AddWeaponForm
            onClose={clearForm}
            onAddWeapon={handleAddWeapon}
          />
        )}
        {form === PlannerFormType.ManagePriority && (
          <ManagePriorityComponent
            plannerItems={plannerItems}
            onClose={clearForm}
            onDragAndDrop={updatePlannerPriority}
          />
        )}
        {form === PlannerFormType.Inventory && (
          <InventoryForm
            onSubmit={handleInventorySubmit}
            initialFormData={dbItems}
            apiItems={items}
            onClose={clearForm}
          />
        )}
        {form === PlannerFormType.EditSelectedMaterials && (
          <EditSelectedMaterialsForm
            onClose={clearForm}
            onSubmit={handleEditSelectedMaterials}
            inventory={dbItems}
          // selectedItem={selectedItem}
          />
        )}
        <PlannerDataComponent
          plannerItems={plannerItems}
          apiItems={items}
          inventory={dbItems}
          onEditResonator={handleEditResonator}
          onEditWeapon={handleEditWeapon}
          onToggleActive={handleToggleActive}
          onDelete={handleDeletePlannerItem}
        />
      </div>
    </div>
  );
}

const PlannerPage = () => {
  return (
    <PlannerFormProvider>
      <CharactersPage />
    </PlannerFormProvider>
  );
}
export default PlannerPage;