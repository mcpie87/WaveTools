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
import classNames from "classnames";

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
  value: number;
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
  const [displayedCategory, setDisplayedCategory] = useState<string | null>(null);
  const [displayedRarity, setDisplayedRarity] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showTotalMats, setShowTotalMats] = useState<boolean>(false);
  const [shops, setShops] = useState<Record<string, IItemToShops>>({});

  useEffect(() => {
    const fetchData = async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const dishesResponse = await fetch(`${basePath}/data/cooking.json`);
      const dishesData = await dishesResponse.json();
      const synthesisResponse = await fetch(`${basePath}/data/synthesis.json`);
      const synthesisData = await synthesisResponse.json();
      const processedResponse = await fetch(`${basePath}/data/cookprocessed.json`);
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

  const setCategory = (category: ERecipeType | null) => {
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

  const toggleShowTotalMats = (show: boolean) => {
    setShowTotalMats(show);
  }

  const getBaseMaterials = (material: IRecipeItem): IRecipeItem[] => {
    const matchingFormula = baseFilteredFormulas
      .find((baseFormula) => baseFormula.resultItem.name === material.name);

    if (!matchingFormula) return [material];

    const retMaterials = [];
    for (const materials of matchingFormula.materials) {
      retMaterials.push(getBaseMaterials(materials));
    }
    return retMaterials.flat();
  }

  const reduceMaterials = (materials: IRecipeItem[]): IRecipeItem[] => {
    const retMaterials: Record<string, IRecipeItem> = {};
    for (const material of materials) {
      if (retMaterials[material.name]) {
        retMaterials[material.name].value += material.value;
      } else {
        retMaterials[material.name] = material;
      }
    }

    return Object.values(retMaterials);
  }

  let filteredFormulas = baseFilteredFormulas
    .filter((formula) => !displayedCategory || formula.type === displayedCategory)
    .filter((formula) => formula.formulaType !== 3) // 3 === Synthesis Conversion Materials
    .filter((formula) => !displayedRarity || formula.resultItem.rarity === displayedRarity)
    .filter((formula) => !searchQuery || searchQueryPredicate(searchQuery, formula));

  if (showTotalMats) {
    filteredFormulas = filteredFormulas.map((formula) => ({
      ...formula,
      materials: reduceMaterials(
        formula.materials.flatMap((material) => getBaseMaterials(material))
      ),
    }));
  }

  const MaterialComponent = ({ material }: { material: IRecipeItem }) => {
    if (!material) return null;
    const matchingFormula = baseFilteredFormulas
      .find((formula) => formula.resultItem.name === material.name);

    const rowComponent = (
      <div className="bg-base-300 rounded-md inline-flex justify-between col-span-1 w-full h-fit">
        {/* <ItemCard item={material} width={32} height={32} /> */}
        <div className="h-9 w-9 shrink-0 relative">
          <Image
            className="w-[32px] h-[32px] z-10 bg-transparent absolute inset-0"
            src={convertToUrl(material.icon)}
            alt={material.name}
            width={32}
            height={32}
          />
          <div
            className={classNames(
              "rounded-md absolute inset-0 bg-gradient-to-t via-transparent via-50% to-transparent",
              { "from-yellow-300/50": material.rarity === 5 },
              { "from-purple-600/50": material.rarity === 4 },
              { "from-blue-500/50": material.rarity === 3 },
              { "from-green-300/50": material.rarity === 2 },
              { "from-gray-400/50": material.rarity === 1 }
            )}
          />
          <span className="absolute bottom-0 right-0 text-xs font-thin p-0.5 bg-black/70 rounded-br-md rounded-tl-md rounded-tr-md text-white z-10">
            {material.value}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <h2 className="leading-none text-wrap max-w-48">{material.name}</h2>
          {material.price && (
            <div className="inline-flex gap-0.5 w-full">
              <Image
                src={convertToUrl(SHELL_CREDIT_ICON_URL)}
                alt="Shell credits image"
                className="h-4 w-4"
                width={24}
                height={24}
              />
              <p className="text-xs font-thin leading-none">{material.price}</p>
            </div>
          )}
        </div>
        {/* <div className="bg-black rounded-r-md px-2 flex items-center text-white">
          <span>{material.value}</span>
        </div> */}
        {/*         
        <div>
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
        </div> */}
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
        <button onClick={() => setCategory(null)}>All</button>
        <button onClick={() => setCategory(ERecipeType.synthesis)}>Synthesis</button>
        <button onClick={() => setCategory(ERecipeType.dish)}>Dish</button>
        <button onClick={() => setCategory(ERecipeType.processed)}>Processed</button>
        <button onClick={() => setRarity(1)}>1</button>
        <button onClick={() => setRarity(2)}>2</button>
        <button onClick={() => setRarity(3)}>3</button>
        <button onClick={() => setRarity(4)}>4</button>
        <button onClick={() => setRarity(5)}>5</button>
        <button onClick={() => setRarity(null)}>all</button>
        <div className="flex flex-row justify-between items-center">
          <input type="checkbox" onChange={(e) => toggleShowTotalMats(e.target.checked)} />
          <span>Show Total Materials</span>
        </div>
      </div>
      <div className="flex flex-col justify-center m-auto gap-4 w-[800px]">
        {filteredFormulas.map((item) => (
          <div key={item.id} className="max-w-4xl mx-auto p-2">
            <div className="flex flex-col gap-1 bg-base-200 p-2 rounded-md border">
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
          </div>
        ))}
      </div>
    </div >
  );
}