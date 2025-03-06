import { useCharacters } from "@/context/CharacterContext";
import { useWeapons } from "@/context/WeaponContext";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { WeaponStateDBEntry } from "@/types/weaponTypes";
import { updateSharedPriority } from "@/utils/priorityUtils";

export const usePriority = () => {
  const { characters, updatePriorities: updateResonatorPriorities } = useCharacters();
  const { weapons, updatePriorities: updateWeaponPriorities } = useWeapons();

  const updatePriority = (
    target: ResonatorStateDBEntry | WeaponStateDBEntry,
    newPriority: number
  ) => {
    const {
      newResonators,
      newWeapons
    } = updateSharedPriority(characters, weapons, target, newPriority);
    // TODO: make it atomic somehow
    updateResonatorPriorities(newResonators);
    updateWeaponPriorities(newWeapons);
  }

  return { updatePriority };
}