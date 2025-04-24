import { IItem } from "@/app/interfaces/item";
import { ItemWeapon } from "@/app/interfaces/item_types";
import { inventoryForSynthesis } from "@/test/__mocks__/inventoryMocks";
import { itemListForSynthesis } from "@/test/__mocks__/itemMocks";
import { applySynthesizerOnItems } from "./planner_utils";
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
});