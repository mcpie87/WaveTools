import { IResonatorPlanner, IWeaponPlanner, PLANNER_TYPE } from "@/app/interfaces/planner_item";
import { useCharacters } from "@/context/CharacterContext";
import { useWeapons } from "@/context/WeaponContext";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { WeaponStateDBEntry } from "@/types/weaponTypes";
import { updateSharedPriority } from "@/utils/priorityUtils";

export const usePlanner = () => {
  const {
    characters,
    updatePriorities: updateResonatorPriorities,
    deleteCharacter,
    updateCharacter,
  } = useCharacters();
  const {
    weapons,
    updatePriorities: updateWeaponPriorities,
    deleteWeapon,
    updateWeapon,
  } = useWeapons();

  const updatePlannerPriority = (
    target: IResonatorPlanner | IWeaponPlanner,
    newPriority: number
  ) => {
    applyPlannerChanges(target, newPriority);
  }

  const deletePlannerItem = (target: IResonatorPlanner | IWeaponPlanner) => {
    deleteTargetItem(target);
    applyPlannerChanges(target);
  }

  const applyPlannerChanges = (
    target: IResonatorPlanner | IWeaponPlanner,
    newPriority?: number
  ) => {
    const {
      newResonators,
      newWeapons
    } = updateSharedPriority(characters, weapons, target.dbData, newPriority);

    // TODO: make it atomic somehow
    updateResonatorPriorities(newResonators);
    updateWeaponPriorities(newWeapons);
  }

  const deleteTargetItem = (target: IResonatorPlanner | IWeaponPlanner) => {
    if (target.type === PLANNER_TYPE.RESONATOR) {
      deleteCharacter(target.name);
    } else if (target.type === PLANNER_TYPE.WEAPON) {
      deleteWeapon(target.dbData as WeaponStateDBEntry);
    } else {
      console.error("Unknown planner type", target);
    }
  }

  const toggleActive = (target: IResonatorPlanner | IWeaponPlanner) => {
    target.dbData.isActive = !target.dbData.isActive;
    if (target.type === PLANNER_TYPE.RESONATOR) {
      updateCharacter(target.name, target.dbData as ResonatorStateDBEntry);
    } else if (target.type === PLANNER_TYPE.WEAPON) {
      updateWeapon(target.name, target.dbData as WeaponStateDBEntry);
    } else {
      console.error("Unknown planner type", target);
    }
  }

  return { updatePlannerPriority, deletePlannerItem, toggleActive };
}