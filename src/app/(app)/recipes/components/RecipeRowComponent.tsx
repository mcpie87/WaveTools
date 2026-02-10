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
    <div className="p-2">
      <div className="bg-base-200 border rounded-lg p-3 flex flex-col gap-3">

        {/* Header */}
        <div className="flex flex-row gap-2 items-center">
          <div className="w-30">
            <ItemCard item={item.resultItem} width={64} height={64} />
          </div>
          <div className="flex flex-col">
            <h2 className="font-semibold leading-tight">
              {item.resultItem.name}
            </h2>
            <p className="text-sm opacity-80">
              {item.resultItem.attributes_description}
            </p>
          </div>
        </div>

        {/* Materials */}
        <div className="flex gap-2">
          {item.materials.map((material) => (
            <div
              key={material.id}
              className="border rounded-md bg-base-100 p-1"
            >
              <MaterialComponent
                material={material}
                baseFilteredFormulas={baseFilteredFormulas}
              />
            </div>
          ))}
        </div>

        {/* Specialty */}
        {item.specialtyCook && item.specialtyItem && (
          <div className="border-t pt-3 flex gap-3">
            <div className="w-30">
              <ItemCard item={item.specialtyItem} width={64} height={64} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-medium">
                {item.specialtyItem.name}
              </div>

              <div className="flex items-center gap-2 text-sm opacity-90">
                <Image
                  src={convertToUrl(item.specialtyCook.icon)}
                  alt={item.specialtyCook.name}
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span>{item.specialtyCook.name} Special</span>
              </div>

              <div className="text-sm opacity-80">
                {item.specialtyItem.attributes_description}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
