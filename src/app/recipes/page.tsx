'use client';

import { useData } from "@/context/DataContext";
import { convertCostListToItemList } from "@/utils/items_utils";
import { convertToUrl, getRarityClass } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IItemEntry } from "../interfaces/api_interfaces";
import { IItem } from "../interfaces/item";

const enum ERecipeType {
  synthesis = "synthesis",
  dish = "dish",
  processed = "processed",
}

interface IRecipeFormula {
  id: number;
  type: ERecipeType;
  resultItem: IItem;
  materials: IItemEntry[];
  formulaType?: number;
  specialtyItem?: IItem;
  specialtyCook?: {
    id: number;
    name: string;
    icon: string;
    rarity: number;
  };
}

export default function RecipesPage() {
  const [displayedFormulas, setDisplayedFormulas] = useState<IRecipeFormula[]>([]);
  const [displayedCategory, setDisplayedCategory] = useState<string>("dish");
  const [displayedRarity, setDisplayedRarity] = useState<number | null>(null);
  // const { items: apiItems } = useData();

  useEffect(() => {
    const fetchData = async () => {
      // const response = await fetch("/data/synthesis.json");
      const dishesResponse = await fetch("/data/cooking.json");
      const dishesData = await dishesResponse.json();
      const synthesisResponse = await fetch("/data/synthesis.json");
      const synthesisData = await synthesisResponse.json();
      const processedResponse = await fetch("/data/cookprocessed.json");
      const processedData = await processedResponse.json();
      const data = [...dishesData, ...synthesisData, ...processedData];
      setDisplayedFormulas(data);
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

  const filteredFormulas = displayedFormulas
    .filter((formula) => formula.type === displayedCategory)
    .filter((formula) => formula.formulaType !== 3) // filter out conversion mats
    .filter((formula) => !displayedRarity || formula.resultItem.rarity === displayedRarity);

  const MaterialComponent = ({ material }: { material: IItem }) => {
    if (!material) return null;
    const matchingFormula = displayedFormulas
      .find((formula) => formula.resultItem.name === material.name);
    if (matchingFormula) {
      return (
        <>
          <div>
            <Image
              src={convertToUrl(material.icon)}
              alt={material.name}
              width={32}
              height={32}
            />
            <span>{material.name}</span>
            <span>{material.value}</span>
          </div>
          {convertCostListToItemList(matchingFormula.materials, apiItems).map((material) => (
            <div key={material.id} className="border flex flex-row">
              <MaterialComponent material={material} />
            </div>
          ))}
        </>
      );
    }
    return (
      <div>
        <Image
          src={convertToUrl(material.icon)}
          alt={material.name}
          width={32}
          height={32}
        />
        <span>{material.name}</span>
        <span>{material.value}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-center gap-2">
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
      <div className="flex flex-col justify-center m-auto gap-4">
        {filteredFormulas.map((item) => (
          <div
            key={item.id}
            className={`flex flex-row border border-black ${getRarityClass(item.resultItem.rarity)}`}
          >
            <div className="flex flex-col">
              <Image
                className="w-[64px] h-[64px]"
                src={convertToUrl(item.resultItem.icon)}
                alt={item.resultItem.name}
                width={64}
                height={64}
              />
              <h2>{item.resultItem.name}</h2>
            </div>
            {/* <p>FormulaType: {item.formulaType}</p> */}
            <p>{item.resultItem.attributes_description}</p>
            {/* <p>BgDesc: {item.resultItem.bg_description}</p> */}
            <div className="flex flex-col">
              {convertCostListToItemList(item.materials, apiItems).map((material) => (
                <div key={material.id} className="border flex flex-row">
                  <MaterialComponent material={material} />
                </div>
              ))}
            </div>
            {item.specialtyCook && item.specialtyItem && (
              <>
                <div className="flex flex-col">
                  <Image
                    className="w-[64px] h-[64px]"
                    src={convertToUrl(item.specialtyCook?.icon)}
                    alt={item.specialtyCook?.name}
                    width={64}
                    height={64}
                  />
                  <span>{item.specialtyCook?.name}</span>
                </div>
                <div className="flex flex-col">
                  <Image
                    className="w-[64px] h-[64px]"
                    src={convertToUrl(item.specialtyItem?.icon)}
                    alt={item.specialtyItem?.name}
                    width={64}
                    height={64}
                  />
                  <span>{item.specialtyItem?.name}</span>
                </div>
                <div>{item.specialtyItem?.attributes_description}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}