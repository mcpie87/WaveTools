import { IItem } from "@/app/interfaces/item";
import { ItemResonatorEXP, ItemType, ItemWeapon } from "@/app/interfaces/item_types";
import { inventoryForResonatorExpConversion, inventoryForSynthesis } from "@/test/__mocks__/inventoryMocks";
import { itemListForResonatorExpConversion, itemListForSynthesis } from "@/test/__mocks__/itemMocks";
import { applyEXPConversion, applySynthesizerOnItems, setItemsBasedOnInventory } from "./planner_utils";
import { convertItemListToItemMap } from "./items_utils";
import { InventoryDBSchema } from "@/types/inventoryTypes";

describe('planner utils test', () => {
  describe('synthesizer tests', () => {
    let inventory: InventoryDBSchema;
    let itemMap: Map<string, IItem>;
    let swordItems: IItem[];

    beforeEach(() => {
      inventory = JSON.parse(JSON.stringify(inventoryForSynthesis));
      itemMap = new Map<string, IItem>(
        convertItemListToItemMap(JSON.parse(JSON.stringify(itemListForSynthesis)))
      );
      swordItems = [
        ItemWeapon.SWORD_RARITY_2,
        ItemWeapon.SWORD_RARITY_3,
        ItemWeapon.SWORD_RARITY_4,
        ItemWeapon.SWORD_RARITY_5
      ].map(e => itemMap.get(e)!);

      for (const swordItem of swordItems) {
        swordItem.value = 0;
        swordItem.converted = undefined;
      }
    });

    test('empty stock should not modify anything', () => {
      for (const swordItem of swordItems) {
        swordItem.value = 0;
        swordItem.converted = undefined;
      }

      applySynthesizerOnItems(itemMap, inventory);

      for (const swordItem of swordItems) {
        expect(swordItem.value).toBe(0);
        expect(swordItem.converted).toBeUndefined();
      }
    });

    test('synthesis should convert 2* to 3* (needed 3* is lower)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 4;
      inventory[swordItems[0].name].owned = 17; // 5 * 3 + 2

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].converted).toBe(4);
      expect(inventory[swordItems[0].name].owned).toBe(5); // 17 - 4 * 3 = 5
      expect(swordItems[1].value).toBe(swordItems[1].converted);
    });

    test('synthesis should convert 2* to 3* (needed 3* is equal)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 3;
      inventory[swordItems[0].name].owned = 10;

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].converted).toBe(3); // 10 // 3 = 3
      expect(inventory[swordItems[0].name].owned).toBe(1); // 10 % 3 = 1
      expect(swordItems[1].value).toBe(swordItems[1].converted);
    });

    test('synthesis should convert 2* to 3* (needed 3* is greater)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 5;
      inventory[swordItems[0].name].owned = 10;

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].converted).toBe(3); // 10 // 3 = 3
      expect(inventory[swordItems[0].name].owned).toBe(1); // 10 % 3 = 1
      expect(swordItems[1].value).toBe(swordItems[1].converted! + 2); // 5 - 2 = 3
    });

    test('synthesis should convert 2* to 4* (needed 4* is lower)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 1;
      inventory[swordItems[0].name].owned = 19; // 2 * 9 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].converted).toBe(1);
      expect(inventory[swordItems[0].name].owned).toBe(10); // 19 - 1 * 9 = 10
      expect(swordItems[2].value).toBe(swordItems[2].converted);
    });

    test('synthesis should convert 2* to 4* (needed 4* is equal)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 2;
      inventory[swordItems[0].name].owned = 19; // 2 * 9 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].converted).toBe(2); // 19 // 9 = 2
      expect(inventory[swordItems[0].name].owned).toBe(1); // 19 % 9 = 1
      expect(swordItems[2].value).toBe(swordItems[2].converted);
    });

    test('synthesis should convert 2* to 4* (needed 4* is greater)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 6;
      inventory[swordItems[0].name].owned = 19; // 2 * 9 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].converted).toBe(2); // 19 // 9 = 2
      expect(inventory[swordItems[0].name].owned).toBe(1); // 19 % 9 = 1
      expect(swordItems[2].value).toBe(swordItems[2].converted! + 4); // 6 - 2 = 4
    });

    test('synthesis should convert 2* to 5* (needed 5* is lower)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 2;
      inventory[swordItems[0].name].owned = 82; // 3 * 27 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(2);
      expect(inventory[swordItems[0].name].owned).toBe(28); // 82 - 2 * 27 = 28
      expect(swordItems[3].value).toBe(swordItems[3].converted);
    });

    test('synthesis should convert 2* to 5* (needed 5* is equal)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 2;
      inventory[swordItems[0].name].owned = 55; // 2 * 27 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(2); // 55 // 27 = 2
      expect(inventory[swordItems[0].name].owned).toBe(1); // 55 % 27 = 1
      expect(swordItems[3].value).toBe(swordItems[3].converted);
    });

    test('synthesis should convert 2* to 5* (needed 5* is greater)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 7;
      inventory[swordItems[0].name].owned = 55; // 2 * 27 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(2); // 55 // 27 = 2
      expect(inventory[swordItems[0].name].owned).toBe(1); // 55 % 27 = 1
      expect(swordItems[3].value).toBe(swordItems[3].converted! + 5); // 7 - 2 = 5
    });

    test('synthesis should convert 3* to 4* (needed 4* is lower)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 4;
      inventory[swordItems[1].name].owned = 15; // 5 * 3 + 0

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].converted).toBe(4);
      expect(inventory[swordItems[1].name].owned).toBe(3); // 15 - 4*3 = 3
      expect(swordItems[2].value).toBe(swordItems[2].converted);
    });

    test('synthesis should convert 3* to 4* (needed 4* is equal)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 3;
      inventory[swordItems[1].name].owned = 10; // 2 * 3 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].converted).toBe(3); // 10 // 3 = 3
      expect(inventory[swordItems[1].name].owned).toBe(1); // 10 % 3 = 1
      expect(swordItems[2].value).toBe(swordItems[2].converted);
    });

    test('synthesis should convert 3* to 4* (needed 4* is greater)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 6;
      inventory[swordItems[1].name].owned = 10; // 2 * 3 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].converted).toBe(3); // 10 // 3 = 3
      expect(inventory[swordItems[1].name].owned).toBe(1); // 10 % 3 = 1
      expect(swordItems[2].value).toBe(swordItems[2].converted! + 3); // 6 - 3 = 3
    });

    test('synthesis should convert 3* to 5* (needed 5* is lower)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 1;
      inventory[swordItems[1].name].owned = 28; // 3 * 9 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(1); // = .value
      expect(inventory[swordItems[1].name].owned).toBe(19); // 28 - 9
      expect(swordItems[3].value).toBe(swordItems[3].converted);
    });

    test('synthesis should convert 3* to 5* (needed 5* is equal)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 3;
      inventory[swordItems[1].name].owned = 28; // 3 * 9 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(3); // 28 // 9 = 3
      expect(inventory[swordItems[1].name].owned).toBe(1); // 28 % 9 = 1
      expect(swordItems[3].value).toBe(swordItems[3].converted);
    });

    test('synthesis should convert 3* to 5* (needed 5* is greater)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 8;
      inventory[swordItems[1].name].owned = 28; // 3 * 9 + 1

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(3); // 28 // 9 = 3
      expect(inventory[swordItems[1].name].owned).toBe(1); // 28 % 9 = 1
      expect(swordItems[3].value).toBe(swordItems[3].converted! + 5); // 8 - 3 = 5
    });

    test('synthesis should convert 4* to 5* (needed 5* is lower)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 3;
      inventory[swordItems[2].name].owned = 11; // 3 * 3 + 2

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(3); // 11 // 3 = 3
      expect(inventory[swordItems[2].name].owned).toBe(2); // 11 % 3 = 2
      expect(swordItems[3].value).toBe(swordItems[3].converted);
    });

    test('synthesis should convert 4* to 5* (needed 5* is equal)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 1;
      inventory[swordItems[2].name].owned = 11; // 3 * 3 + 2

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(1); // (1 * 3) // 3 = 1
      expect(inventory[swordItems[2].name].owned).toBe(8); // 11 - (1 * 3) % 3 = 8
      expect(swordItems[3].value).toBe(swordItems[3].converted);
    });

    test('synthesis should convert 4* to 5* (needed 5* is greater)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 0;
      swordItems[3].value = 9;
      inventory[swordItems[2].name].owned = 11; // 3 * 3 + 2

      applySynthesizerOnItems(itemMap, inventory);

      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].converted).toBe(3); // 11 // 3 = 3
      expect(inventory[swordItems[2].name].owned).toBe(2); // 11 % 3 = 2
      expect(swordItems[3].value).toBe(swordItems[3].converted! + 6); // 9 - 3 = 6
    });

    test('synthesis should convert 2* to 3/4/5 in ascending order', () => {
      swordItems[0].value = 0; // assumes that subtraction was already done
      swordItems[1].value = 5;
      swordItems[2].value = 14;
      swordItems[3].value = 28;
      // covers 3* and 4*, 5* does only 1 out of 28, 7 is the remainder
      inventory[swordItems[0].name].owned = 175; // (5 * 3) + (14 * 9) + (1 * 27) + 7

      applySynthesizerOnItems(itemMap, inventory);

      // Values should be still same
      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(5);
      expect(swordItems[2].value).toBe(14);
      expect(swordItems[3].value).toBe(28);

      expect(swordItems[0].converted).toBe(undefined); // should be untouched
      expect(swordItems[1].converted).toBe(5);
      expect(swordItems[2].converted).toBe(14);
      expect(swordItems[3].converted).toBe(1); // cause we do only 1 out of 28
      expect(inventory[swordItems[0].name].owned).toBe(7);
    });

    test('synthesis from 2* should prioritize lower rarity conversion', () => {
      swordItems[0].value = 0; // assumes that subtraction was already done
      swordItems[1].value = 3; // 3*3
      swordItems[2].value = 0; // 0*9
      swordItems[3].value = 1; // 1*27
      inventory[swordItems[0].name].owned = 28; // just a bit over needed for 5*

      applySynthesizerOnItems(itemMap, inventory);

      // Values should be still same
      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(3);
      expect(swordItems[2].value).toBe(0);
      expect(swordItems[3].value).toBe(1);

      expect(swordItems[0].converted).toBe(undefined); // should be untouched
      expect(swordItems[1].converted).toBe(3);
      expect(swordItems[2].converted).toBe(undefined); // should be untouched
      expect(swordItems[3].converted).toBe(undefined); // undefined cause 28 - 9 = 19, not enough for 27
      expect(inventory[swordItems[0].name].owned).toBe(19); // 28 - 9 = 19
    });

    // TODO: write this correctly, requires a lot of time tho
    // test('subtract and synthesis brute force', () => {
    //   // Adjust ranges for test purposes - this is expensive
    //   const ranges = [
    //     2, // sword2
    //     2, // sword3
    //     1, // sword4
    //     1, // sword5
    //     27, // inventorySword2
    //     9, // inventorySword3
    //     3, // inventorySword4
    //     1, // inventorySword5
    //   ].map(e => Array.from(Array(e + 1).keys()));
    //   const product = new CartesianProduct(...ranges);
    //   for (const indices of product) {
    //     const [
    //       sword2,
    //       sword3,
    //       sword4,
    //       sword5,
    //       inventorySword2,
    //       inventorySword3,
    //       inventorySword4,
    //       inventorySword5
    //     ] = indices;

    //     swordItems[0].value = sword2;
    //     swordItems[1].value = sword3;
    //     swordItems[2].value = sword4;
    //     swordItems[3].value = sword5;
    //     inventory[swordItems[0].name].owned = inventorySword2;
    //     inventory[swordItems[1].name].owned = inventorySword3;
    //     inventory[swordItems[2].name].owned = inventorySword4;
    //     inventory[swordItems[3].name].owned = inventorySword5;

    //     // We subtract inventory and then synthesize
    //     setItemsBasedOnInventory(itemMap, inventory);

    //     // Time to test
    //     expect(swordItems[0].value).toBe(Math.max(0, sword2 - inventorySword2));
    //     expect(swordItems[1].value).toBe(Math.max(0, sword3 - inventorySword3));
    //     expect(swordItems[2].value).toBe(Math.max(0, sword4 - inventorySword4));
    //     expect(swordItems[3].value).toBe(Math.max(0, sword5 - inventorySword5));
    //     expect(swordItems[0].converted).toBe(undefined); // should be untouched

    //     const conversion2to3 = inventorySword2 / 3 > swordItems[1].value ? swordItems[1].value : Math.floor(inventorySword2 / 3);
    //     const totalConversionsTo3 = conversion2to3;
    //     if (swordItems[1].value > 0 && totalConversionsTo3 > 0) {
    //       expect(swordItems[1].converted).toBe(totalConversionsTo3);
    //     }

    //     const conversion3to4 = inventorySword3 / 3 > swordItems[2].value ? swordItems[2].value : Math.floor(inventorySword3 / 3);
    //     const conversion2to4 = (inventorySword2 - conversion2to3 * 3) / 9 > (swordItems[2].value - conversion3to4) ? (swordItems[2].value - conversion3to4) : Math.floor((inventorySword2 - conversion2to3 * 3) / 9);
    //     const totalConversionsTo4 = conversion2to4 + conversion3to4;
    //     if (swordItems[2].value > 0 && totalConversionsTo4 > 0) {
    //       try {
    //         expect(swordItems[2].converted).toBe(totalConversionsTo4);
    //       } catch (err) {
    //         console.log("Failed for", indices, swordItems[2].converted, totalConversionsTo4);
    //         console.log("Sword", swordItems.map(e => `${e.name}: ${e.value} : ${e.converted}`));
    //         console.log("Inventory", Object.values(inventory).map(e => `${e.name}: ${e.owned}`));
    //       }
    //     }
    //   }
    // });
  });

  describe('resonator and weapon exp conversion', () => {
    let inventory: InventoryDBSchema;
    let itemMap: Map<string, IItem>;
    let expItems: IItem[];

    beforeEach(() => {
      inventory = JSON.parse(JSON.stringify(inventoryForResonatorExpConversion));
      itemMap = new Map<string, IItem>(
        convertItemListToItemMap(JSON.parse(JSON.stringify(itemListForResonatorExpConversion)))
      );
      expItems = [
        ItemResonatorEXP.RARITY_2,
        ItemResonatorEXP.RARITY_3,
        ItemResonatorEXP.RARITY_4,
        ItemResonatorEXP.RARITY_5,
      ].map(e => itemMap.get(e)!);

      for (const expItem of expItems) {
        expItem.value = 0;
        expItem.converted = undefined;
      }
    });

    test('exp conversion from 2* to 5* should empty stock and set converted', () => {
      expItems[0].value = 0;
      expItems[1].value = 0;
      expItems[2].value = 0;
      expItems[3].value = 8;

      inventory[expItems[0].name].owned = 10 * (20000 / 1000);
      inventory[expItems[1].name].owned = 0;
      inventory[expItems[2].name].owned = 0;
      inventory[expItems[3].name].owned = 0;

      applyEXPConversion(ItemType.RESONATOR_EXP, itemMap, inventory);

      expect(expItems[0].value).toBe(0);
      expect(expItems[1].value).toBe(0);
      expect(expItems[2].value).toBe(0);
      expect(expItems[3].value).toBe(8);

      expect(expItems[0].converted).toBeUndefined();
      expect(expItems[1].converted).toBeUndefined();
      expect(expItems[2].converted).toBeUndefined();
      expect(expItems[3].converted).toBe(8);

      expect(inventory[expItems[0].name].owned).toBe(2 * (20000 / 1000));
      expect(inventory[expItems[1].name].owned).toBe(0);
      expect(inventory[expItems[2].name].owned).toBe(0);
      expect(inventory[expItems[3].name].owned).toBe(0);
    });

    test('exp conversion from 3* to 5* should empty stock and set converted', () => {
      expItems[0].value = 0;
      expItems[1].value = 0;
      expItems[2].value = 0;
      expItems[3].value = 8; // 8 * 20k = 160k

      inventory[expItems[0].name].owned = 0;
      inventory[expItems[1].name].owned = 60; // 60 * 3k = 180k
      inventory[expItems[2].name].owned = 0;
      inventory[expItems[3].name].owned = 0;

      applyEXPConversion(ItemType.RESONATOR_EXP, itemMap, inventory);

      expect(expItems[0].value).toBe(0);
      expect(expItems[1].value).toBe(0);
      expect(expItems[2].value).toBe(0);
      expect(expItems[3].value).toBe(8);

      expect(expItems[0].converted).toBeUndefined();
      expect(expItems[1].converted).toBeUndefined();
      expect(expItems[2].converted).toBeUndefined();
      expect(expItems[3].converted).toBe(8);

      expect(inventory[expItems[0].name].owned).toBe(0);
      expect(inventory[expItems[1].name].owned).toBe(6); // floor 20k
      expect(inventory[expItems[2].name].owned).toBe(0);
      expect(inventory[expItems[3].name].owned).toBe(0);
    });

    test('exp conversion from 4* to 5* should empty stock and set converted', () => {
      expItems[0].value = 0;
      expItems[1].value = 0;
      expItems[2].value = 0;
      expItems[3].value = 7; // 7 * 20k = 140k

      inventory[expItems[0].name].owned = 0;
      inventory[expItems[1].name].owned = 0; // 18 * 8k = 144k
      inventory[expItems[2].name].owned = 18;
      inventory[expItems[3].name].owned = 0;

      applyEXPConversion(ItemType.RESONATOR_EXP, itemMap, inventory);

      expect(expItems[0].value).toBe(0);
      expect(expItems[1].value).toBe(0);
      expect(expItems[2].value).toBe(0);
      expect(expItems[3].value).toBe(7);

      expect(expItems[0].converted).toBeUndefined();
      expect(expItems[1].converted).toBeUndefined();
      expect(expItems[2].converted).toBeUndefined();
      expect(expItems[3].converted).toBe(7);

      expect(inventory[expItems[0].name].owned).toBe(0);
      expect(inventory[expItems[1].name].owned).toBe(0);
      expect(inventory[expItems[2].name].owned).toBe(0); // exhausted due to floor
      expect(inventory[expItems[3].name].owned).toBe(0);
    });

    test('exp conversion from 2* to others should fill everything', () => {
      expItems[0].value = 0;
      expItems[1].value = 10;
      expItems[2].value = 20;
      expItems[3].value = 30;

      inventory[expItems[0].name].owned = 10 * 3 + 20 * 8 + 30 * 20 + 5; // 5 as extra
      inventory[expItems[1].name].owned = 0;
      inventory[expItems[2].name].owned = 0;
      inventory[expItems[3].name].owned = 0;

      applyEXPConversion(ItemType.RESONATOR_EXP, itemMap, inventory);

      expect(expItems[0].value).toBe(0);
      expect(expItems[1].value).toBe(10);
      expect(expItems[2].value).toBe(20);
      expect(expItems[3].value).toBe(30);

      expect(expItems[0].converted).toBeUndefined();
      expect(expItems[1].converted).toBe(10);
      expect(expItems[2].converted).toBe(20);
      expect(expItems[3].converted).toBe(30);

      expect(inventory[expItems[0].name].owned).toBe(5);
      expect(inventory[expItems[1].name].owned).toBe(0);
      expect(inventory[expItems[2].name].owned).toBe(0);
      expect(inventory[expItems[3].name].owned).toBe(0);
    });

    test('exp conversion from others to 5* should fill total', () => {
      expItems[0].value = 0;
      expItems[1].value = 0;
      expItems[2].value = 0;
      expItems[3].value = 30; // 600k

      inventory[expItems[0].name].owned = 320; // 600 - 200 - 80 = 320
      inventory[expItems[1].name].owned = 28; // 84k -> 1 item left (due to ceil)
      inventory[expItems[2].name].owned = 26; // 208k -> 1 item left
      inventory[expItems[3].name].owned = 0;

      applyEXPConversion(ItemType.RESONATOR_EXP, itemMap, inventory);

      expect(expItems[0].value).toBe(0);
      expect(expItems[1].value).toBe(0);
      expect(expItems[2].value).toBe(0);
      expect(expItems[3].value).toBe(30);

      expect(expItems[0].converted).toBeUndefined();
      expect(expItems[1].converted).toBeUndefined();
      expect(expItems[2].converted).toBeUndefined();
      expect(expItems[3].converted).toBe(30);

      expect(inventory[expItems[0].name].owned).toBe(0); // exhausted
      expect(inventory[expItems[1].name].owned).toBe(1); // ceil
      expect(inventory[expItems[2].name].owned).toBe(1); // ceil
      expect(inventory[expItems[3].name].owned).toBe(0);
    });
  });

  describe('inventory subtraction combined with synthesis', () => {
    let inventory: InventoryDBSchema;
    let itemMap: Map<string, IItem>;
    let swordItems: IItem[];

    beforeEach(() => {
      inventory = JSON.parse(JSON.stringify(inventoryForSynthesis));
      itemMap = new Map<string, IItem>(
        convertItemListToItemMap(JSON.parse(JSON.stringify(itemListForSynthesis)))
      );
      swordItems = [
        ItemWeapon.SWORD_RARITY_2,
        ItemWeapon.SWORD_RARITY_3,
        ItemWeapon.SWORD_RARITY_4,
        ItemWeapon.SWORD_RARITY_5
      ].map(e => itemMap.get(e)!);

      for (const swordItem of swordItems) {
        swordItem.value = 0;
        swordItem.converted = undefined;
      }
    });

    test('synthesis - real world test (convert 2/3/4 to 3/4/5)', () => {
      swordItems[0].value = 0; // assumes that subtraction was already done
      swordItems[1].value = 6; // 3*3
      swordItems[2].value = 20; // 0*9
      swordItems[3].value = 47; // 1*27
      inventory[swordItems[0].name].owned = 402;
      inventory[swordItems[1].name].owned = 180;
      inventory[swordItems[2].name].owned = 47;
      inventory[swordItems[3].name].owned = 0;

      setItemsBasedOnInventory(itemMap, inventory);
      // Values should be subtracted if needed
      expect(swordItems[0].value).toBe(0); // no need
      expect(swordItems[1].value).toBe(0); // Math.max(0, 6 - 180)
      expect(swordItems[2].value).toBe(0); // Math.max(0, 20 - 47)
      expect(swordItems[3].value).toBe(47); // Math.max(0, 47 - 0)

      // Checking conversions
      expect(swordItems[0].converted).toBe(undefined); // should be untouched
      expect(swordItems[1].converted).toBe(undefined); // should be untouched
      expect(swordItems[2].converted).toBe(undefined); // should be untouched
      expect(swordItems[3].converted).toBe(42); // (47-20) // 3 + (180-6) // 9 + 402 // 27

      expect(inventory[swordItems[0].name].owned).toBe(24); // 402 - 378 = 24
      expect(inventory[swordItems[1].name].owned).toBe(3);
      expect(inventory[swordItems[2].name].owned).toBe(0);
      expect(inventory[swordItems[3].name].owned).toBe(0);
    });

    test('synthesis - 2nd real world test (convert 2/3/4 to 3/4/5)', () => {
      swordItems[0].value = 25;
      swordItems[1].value = 28;
      swordItems[2].value = 88;
      swordItems[3].value = 157;
      inventory[swordItems[0].name].owned = 402;
      inventory[swordItems[1].name].owned = 180;
      inventory[swordItems[2].name].owned = 47;
      inventory[swordItems[3].name].owned = 0;

      setItemsBasedOnInventory(itemMap, inventory);

      // Values should be subtracted if needed
      expect(swordItems[0].value).toBe(0); // Math.max(0, 25 - 402);
      expect(swordItems[1].value).toBe(0); // Math.max(0, 28 - 180)
      expect(swordItems[2].value).toBe(41); // Math.max(0, 88 - 47) = 41
      expect(swordItems[3].value).toBe(157); // Math.max(0, 157 - 0)
      // Stock after subtraction: [377, 152, 0, 0]

      // Checking conversions
      expect(swordItems[0].converted).toBe(undefined); // should be untouched
      expect(swordItems[1].converted).toBe(undefined); // should be untouched
      expect(swordItems[2].converted).toBe(41); // Math.min(41, 152 // 3 ... >= 50) // 123 3* items used
      // Stock after conversion to 4*: [377, 29, 0, 0],
      expect(swordItems[3].converted).toBe(16); // (29 // 9 = 3) + (377 // 27) = 16
      // Stock after conversion to 4* and 5*: [377 - 351 = 26, 20 - 18 = 2, 0, 0],
      expect(inventory[swordItems[0].name].owned).toBe(26);
      expect(inventory[swordItems[1].name].owned).toBe(2);
      expect(inventory[swordItems[2].name].owned).toBe(0);
      expect(inventory[swordItems[3].name].owned).toBe(0);
    });

    test('synthesis - 3nd real world test (convert 2/3/4 to 3/4/5)', () => {
      swordItems[0].value = 0;
      swordItems[1].value = 0;
      swordItems[2].value = 20;
      swordItems[3].value = 47;
      inventory[swordItems[0].name].owned = 440;
      inventory[swordItems[1].name].owned = 228;
      inventory[swordItems[2].name].owned = 57;
      inventory[swordItems[3].name].owned = 1;

      setItemsBasedOnInventory(itemMap, inventory);

      // Values should be subtracted if needed
      expect(swordItems[0].value).toBe(0);
      expect(swordItems[1].value).toBe(0);
      expect(swordItems[2].value).toBe(0); // Math.max(0, 20 - 57) = 0
      expect(swordItems[3].value).toBe(46); // Math.max(0, 47 - 1) = 46
      // Stock after subtraction: [440, 228, 37, 0],

      // Checking conversions
      expect(swordItems[0].converted).toBe(undefined); // should be untouched
      expect(swordItems[1].converted).toBe(undefined); // should be untouched
      expect(swordItems[2].converted).toBe(undefined); // should be untouched
      expect(swordItems[3].converted).toBe(46); // we have enough for 53

      // Stock after conversion to 4* and 5*: [170, 3, 1, 0],
      expect(inventory[swordItems[0].name].owned).toBe(197);
      expect(inventory[swordItems[1].name].owned).toBe(3);
      expect(inventory[swordItems[2].name].owned).toBe(1);
      expect(inventory[swordItems[3].name].owned).toBe(0);
    });
  });
});