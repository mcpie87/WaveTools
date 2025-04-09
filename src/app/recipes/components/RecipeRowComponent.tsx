'use client';

import ItemCard from "@/components/items/ItemCard";
import { IRecipeFormula } from "../RecipeTypes";
import { MaterialComponent } from "./MaterialRowComponent";
import Image from "next/image";
import { convertToUrl } from "@/utils/utils";

interface RecipeRowComponentProps {
  item: IRecipeFormula;
  baseFilteredFormulas: IRecipeFormula[];
}
export const RecipeRowComponent = ({
  item,
  baseFilteredFormulas,
}: RecipeRowComponentProps) => {
  return (
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
              <MaterialComponent
                material={material}
                baseFilteredFormulas={baseFilteredFormulas}
              />
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
  )
}