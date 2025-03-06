
import { PLANNER_TYPE } from "@/app/interfaces/planner_item";
import { ResonatorDBSchema, ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { WeaponDBSchema, WeaponStateDBEntry } from "@/types/weaponTypes";

export const updateSharedPriority = (
  resonators: ResonatorDBSchema,
  weapons: WeaponDBSchema,
  target: ResonatorStateDBEntry | WeaponStateDBEntry,
  newPriority: number
) => {
  // make a deep copy to .priority level of all items
  const allItems = [
    ...Object.values(resonators),
    ...Object.values(weapons).flatMap(e => e)
  ].map(item => ({ ...item }));
  const targetItem = getTargetItem(allItems, target);

  const prevPriority = target.priority;

  if (newPriority < target.priority) {
    for (const item of allItems) {
      if (newPriority <= item.priority && item.priority < prevPriority) {
        ++item.priority;
      }
    }
  }

  if (newPriority > target.priority) {
    for (const item of allItems) {
      if (prevPriority < item.priority && item.priority <= newPriority) {
        --item.priority;
      }
    }
  }

  // Force normalization on ordering
  targetItem.priority = newPriority;
  allItems.sort((a, b) => a.priority - b.priority);
  allItems.forEach((item, idx) => item.priority = idx + 1);
  for (const item of allItems) {
    console.log("item", item.priority, item.name);
  }

  const newResonators = allItems.filter(item => item.type === PLANNER_TYPE.RESONATOR);
  const newWeapons = allItems.filter(item => item.type === PLANNER_TYPE.WEAPON);

  return {
    newResonators: newResonators as ResonatorStateDBEntry[],
    newWeapons: newWeapons as WeaponStateDBEntry[],
  };
}

const getTargetItem = (
  allItems: (ResonatorStateDBEntry | WeaponStateDBEntry)[],
  target: ResonatorStateDBEntry | WeaponStateDBEntry
): ResonatorStateDBEntry | WeaponStateDBEntry => {
  const targetItem = 'orderId' in target
    ? allItems.find(
      (item) =>
        item.type === PLANNER_TYPE.WEAPON &&
        item.id === target.id &&
        target.orderId === (item as WeaponStateDBEntry).orderId
    )
    : allItems.find(
      (item) =>
        item.type === PLANNER_TYPE.RESONATOR &&
        item.id === target.id
    );

  if (!targetItem) {
    throw new Error(`Target item not found ${target.id}`);
  }
  return targetItem;
}