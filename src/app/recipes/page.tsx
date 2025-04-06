'use client';

import { useData } from "@/context/DataContext";
import { convertCostListToItemList } from "@/utils/items_utils";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IAPIItem, IItemEntry } from "../interfaces/api_interfaces";
import { IItem } from "../interfaces/item";
import { SHELL_CREDIT_ICON_URL } from "@/constants/constants";
import ItemCard from "@/components/items/ItemCard";

const enum ERecipeType {
  synthesis = "synthesis",
  dish = "dish",
  processed = "processed",
}

interface IRecipeFormulaBase {
  id: number;
  type: ERecipeType;
  resultItem: IItem;
  // materials: (IItem | IItemEntry)[];
  formulaType?: number;
  specialtyItem?: IItem;
  specialtyCook?: {
    id: number;
    name: string;
    icon: string;
    rarity: number;
  };
}

interface IAPIRecipeFormula extends IRecipeFormulaBase {
  materials: IItemEntry[];
}

interface IRecipeItem extends IItem {
  price?: number;
}
interface IRecipeFormula extends IRecipeFormulaBase {
  materials: IRecipeItem[];
}

interface IShop {
  id: number;
  shopName: string;
  price: string[];
  limit: number;
}
interface IItemToShops {
  id: number;
  itemName: string;
  shops: IShop[];
}

const getCheapestShop = (itemName: string, shops: Record<string, IItemToShops>) => {
  const itemToShop = shops[itemName];
  if (!itemToShop) return null;
  let minPrice = Number.MAX_VALUE;
  // let cheapestShop = null;
  for (const shop of itemToShop.shops) {
    if (shop.price.length !== 1) {
      console.error("Shop price is not a single value");
      return null;
    }
    const price = parseInt(shop.price[0].split(" - ")[1]);
    if (price < minPrice) {
      minPrice = price;
      // cheapestShop = shop;
    }
  }
  return minPrice;
}

const postprocessFormulas = (
  formulas: IAPIRecipeFormula[],
  apiItems: IAPIItem[],
  shops: Record<string, IItemToShops>
): IRecipeFormula[] => {
  return formulas.map((formula) => ({
    ...formula,
    materials: convertCostListToItemList(formula.materials, apiItems)
      .map((item) => ({
        ...item,
        price: getCheapestShop(item.name, shops),
      }) as IRecipeItem),
  }));
}

export default function RecipesPage() {
  const [displayedFormulas, setDisplayedFormulas] = useState<IAPIRecipeFormula[]>([]);
  const [displayedCategory, setDisplayedCategory] = useState<string>("dish");
  const [displayedRarity, setDisplayedRarity] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shops, setShops] = useState<Record<string, IItemToShops>>({});

  useEffect(() => {
    const fetchData = async () => {
      const dishesResponse = await fetch("/data/cooking.json");
      const dishesData = await dishesResponse.json();
      const synthesisResponse = await fetch("/data/synthesis.json");
      const synthesisData = await synthesisResponse.json();
      const processedResponse = await fetch("/data/cookprocessed.json");
      const processedData = await processedResponse.json();
      const data = [...dishesData, ...synthesisData, ...processedData];
      setDisplayedFormulas(data);

      const shopsResponse = await fetch("/data/buyable_items.json");
      const shopsData = await shopsResponse.json();
      const shopsMap: Record<string, IItemToShops> = {};
      shopsData.forEach((itemToShop: IItemToShops) => {
        shopsMap[itemToShop.itemName] = itemToShop;
      });
      setShops(shopsMap);
    };
    fetchData();
  }, []);

  const { data, error, loading } = useData();
  if (loading) return (<div>Loading...</div>);
  if (!data) return (<div>Data is not present</div>);
  if (error) return (<div>Error present: {error.message}</div>);
  const { items: apiItems } = data;

  const setCategory = (category: ERecipeType) => {
    setDisplayedCategory(category);
  }
  const setRarity = (rarity: number | null) => {
    setDisplayedRarity(rarity);
  }

  const baseFilteredFormulas = postprocessFormulas(displayedFormulas, apiItems, shops)
  const searchQueryPredicate = (query: string, formula: IRecipeFormula) => {
    if (!query) return true;
    const isNameMatch = formula.resultItem.name.toLowerCase().includes(query.toLowerCase());
    if (isNameMatch) return true;
    const isMaterialMatch = formula.materials
      .some((material) => material.name.toLowerCase().includes(query.toLowerCase()));
    if (isMaterialMatch) return true;

    return false;
  }

  const filteredFormulas = baseFilteredFormulas
    .filter((formula) => formula.type === displayedCategory)
    .filter((formula) => formula.formulaType !== 3) // 3 === Synthesis Conversion Materials
    .filter((formula) => !displayedRarity || formula.resultItem.rarity === displayedRarity)
    .filter((formula) => !searchQuery || searchQueryPredicate(searchQuery, formula));


  const MaterialComponent = ({ material }: { material: IRecipeItem }) => {
    if (!material) return null;
    const matchingFormula = baseFilteredFormulas
      .find((formula) => formula.resultItem.name === material.name);

    const cheapestShop = getCheapestShop(material.name, shops);
    const rowComponent = (
      <div className="flex flex-row">
        <ItemCard item={material} width={32} height={32} />
        <div className="flex flex-col">
          <div>{material.name}</div>
          {cheapestShop && (
            <div className="flex flex-row">
              <Image
                className="w-[24px] h-[24px]"
                src={convertToUrl(SHELL_CREDIT_ICON_URL)}
                alt="shell credit"
                width={24}
                height={24}
              />
              <span>{material.price}</span>
            </div>
          )}
        </div>
        <div>{material.value}</div>
      </div>
    );

    if (!matchingFormula) return rowComponent;

    return (
      <div className="flex flex-col">
        {rowComponent}
        <div className="flex flex-col">
          {matchingFormula.materials.map((material) => (
            <div key={material.id} className="border flex flex-row p-1">
              <MaterialComponent material={material} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
        <button onClick={() => setCategory(ERecipeType.synthesis)}>Synthesis</button>
        <button onClick={() => setCategory(ERecipeType.dish)}>Dish</button>
        <button onClick={() => setCategory(ERecipeType.processed)}>Processed</button>
        <button onClick={() => setRarity(1)}>1</button>
        <button onClick={() => setRarity(2)}>2</button>
        <button onClick={() => setRarity(3)}>3</button>
        <button onClick={() => setRarity(4)}>4</button>
        <button onClick={() => setRarity(5)}>5</button>
        <button onClick={() => setRarity(null)}>all</button>
      </div>
      <div className="flex flex-col justify-center m-auto gap-4 w-[800px]">
        {filteredFormulas.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col border border-black`}
          >
            <div className="flex flex-row">
              <ItemCard item={item.resultItem} width={64} height={64} />
              <div>
                <h2>{item.resultItem.name}</h2>
                <p>{item.resultItem.attributes_description}</p>
              </div>
            </div>
            {/* <p>BgDesc: {item.resultItem.bg_description}</p> */}
            <div className="flex flex-row justify-center">
              {item.materials.map((material) => (
                <div key={material.id} className="border flex flex-row">
                  <MaterialComponent material={material} />
                </div>
              ))}
            </div>
            {item.specialtyCook && item.specialtyItem && (
              <div className="flex flex-row">
                <ItemCard item={item.specialtyItem} width={64} height={64} />
                <div className="flex flex-col">
                  <div>{item.specialtyItem.name}</div>
                  <div className="flex flex-row">
                    <Image
                      className="w-[24px] h-[24px]"
                      src={convertToUrl(item.specialtyCook?.icon)}
                      alt={item.specialtyCook?.name}
                      width={24}
                      height={24}
                    />
                    <div className="flex flex-col">
                      <span>{item.specialtyCook.name} Special</span>
                    </div>
                  </div>
                  <div>{item.specialtyItem?.attributes_description}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}