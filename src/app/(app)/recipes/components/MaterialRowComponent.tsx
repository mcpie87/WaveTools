import { SHELL_CREDIT_ICON_URL } from "@/constants/constants";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import classNames from "classnames";
import { IRecipeFormula, IRecipeItem } from "../RecipeTypes";

interface MaterialComponentProps {
  material: IRecipeItem,
  baseFilteredFormulas: IRecipeFormula[]
}
export const MaterialComponent = ({
  material,
  baseFilteredFormulas
}: MaterialComponentProps) => {
  if (!material) return null;
  const matchingFormula = baseFilteredFormulas
    .find((formula) => formula.resultItem.name === material.name);

  const rowComponent = (
    <div className="bg-base-300 rounded-md inline-flex justify-between col-span-1 w-full h-fit" >
      {/* <ItemCard item={material} width={32} height={32} /> */}
      < div className="h-9 w-9 shrink-0 relative" >
        <Image
          className="w-[32px] h-[32px] z-10 bg-transparent absolute inset-0"
          src={convertToUrl(material.icon)}
          alt={material.name}
          width={32}
          height={32}
        />
        <div
          className={
            classNames(
              "rounded-md absolute inset-0 bg-gradient-to-t via-transparent via-50% to-transparent",
              { "from-yellow-300/50": material.rarity === 5 },
              { "from-purple-600/50": material.rarity === 4 },
              { "from-blue-500/50": material.rarity === 3 },
              { "from-green-300/50": material.rarity === 2 },
              { "from-gray-400/50": material.rarity === 1 }
            )
          }
        />
        < span className="absolute bottom-0 right-0 text-xs font-thin p-0.5 bg-black/70 rounded-br-md rounded-tl-md rounded-tr-md text-white z-10" >
          {material.value}
        </span>
      </div>
      < div className="flex flex-col gap-1 items-center" >
        <h2 className="leading-none text-wrap max-w-48" > {material.name} </h2>
        {
          material.price && (
            <div className="inline-flex gap-0.5 w-full" >
              <Image
                src={convertToUrl(SHELL_CREDIT_ICON_URL)}
                alt="Shell credits image"
                className="h-4 w-4"
                width={24}
                height={24}
              />
              <p className="text-xs font-thin leading-none" > {material.price} </p>
            </div>
          )}
      </div>
    </div>
  );
  if (!matchingFormula) return rowComponent;

  return (
    <div className="flex flex-col" >
      {rowComponent}
      < div className="flex flex-col" >
        {
          matchingFormula.materials.map((material) => (
            <div key={material.id} className="border flex flex-row p-1" >
              <MaterialComponent material={material} baseFilteredFormulas={baseFilteredFormulas} />
            </div>
          ))
        }
      </div>
    </div>
  );
}