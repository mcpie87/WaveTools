'use client';

import { useData } from "@/context/DataContext";
import { convertCostListToItemList } from "@/utils/items_utils";
import { useEffect, useState } from "react";
import { IAPIItem } from "@/app/interfaces/api_interfaces";
// import { FixedSizeList, ListChildComponentProps } from "react-window";
import { EDishType, ERecipeType, IAPIRecipeFormula, IItemToShops, IRecipeFormula, IRecipeItem } from "./RecipeTypes";
import { RecipeRowComponent } from "./components/RecipeRowComponent";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";

// const VirtualizedRecipeList = ({
//   filteredFormulas,
//   baseFilteredFormulas,
// }: {
//   filteredFormulas: IRecipeFormula[];
//   baseFilteredFormulas: IRecipeFormula[];
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const { height, width } = containerRef.current.getBoundingClientRect();
//         setDimensions({ height, width });
//       }
//     };

//     updateDimensions(); // Initial measurement
//     window.addEventListener("resize", updateDimensions); // Update on resize
//     return () => window.removeEventListener("resize", updateDimensions);
//   }, []);

//   const RecipeRow = ({ index, style, data }: ListChildComponentProps) => {
//     const { filteredFormulas, baseFilteredFormulas } = data;
//     const item = filteredFormulas[index];
//     return (
//       <div style={style} className="flex">
//         <RecipeRowComponent
//           key={item.id}
//           item={item}
//           baseFilteredFormulas={baseFilteredFormulas}
//         />
//       </div>
//     );
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="flex flex-col justify-center m-auto gap-4 w-[800px] h-[calc(100vh-150px)]"
//     >
//       {dimensions.height > 0 && dimensions.width > 0 && (
//         <FixedSizeList
//           height={1080} // Matches container height
//           width={1000}   // Matches container width (up to 800px)
//           itemCount={filteredFormulas.length}
//           itemSize={60} // Adjust based on your RecipeRowComponent height
//           itemData={{ filteredFormulas, baseFilteredFormulas }}
//         >
//           {RecipeRow}
//         </FixedSizeList>
//       )}
//     </div>
//   );
// };


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

const COOKING_MATERIAL_LIST: string[] = [
  "Flour",
  "Cooking oil",
  "Salt",
  "Chili",
  "Sugar",
  "Kudzu Root",
  "Rice",
  "Tea",
  "Milk",
];

export default function RecipesPage() {
  const [displayedFormulas, setDisplayedFormulas] = useState<IAPIRecipeFormula[]>([]);
  const [displayedCategory, setDisplayedCategory] = useState<Set<string>>(new Set());
  const [displayedDishCategory, setDisplayedDishCategory] = useState<Set<EDishType>>(new Set());
  const [displayedRarity, setDisplayedRarity] = useState<Set<number>>(new Set());
  const [displayedPage, setDisplayedPage] = useState<number>(0); // 0 indexed
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showTotalMats, setShowTotalMats] = useState<boolean>(false);
  const [disablePurchasableCookingMaterials, setDisablePurchasableCookingMaterials] = useState<boolean>(false);
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

      const shopsResponse = await fetch(`${basePath}/data/buyable_items.json`);
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
    setDisplayedCategory((prev) => {
      if (category === null) return new Set();
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    })
  }
  const setDishCategory = (category: EDishType | null) => {
    setDisplayedDishCategory((prev) => {
      if (category === null) return new Set();
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    })
  }
  const toggleRarity = (rarity: number | null) => {
    setDisplayedRarity((prev) => {
      if (rarity === null) return new Set();
      const newSet = new Set(prev);
      if (newSet.has(rarity)) {
        newSet.delete(rarity);
      } else {
        newSet.add(rarity);
      }
      return newSet;
    })
  }

  const baseFilteredFormulas = postprocessFormulas(displayedFormulas, apiItems, shops)
  const searchQueryPredicate = (query: string, formula: IRecipeFormula) => {
    if (!query?.trim()) return true;

    const isMatch = (name: string | undefined) => {
      return !!name?.toLowerCase().includes(query.toLowerCase());
    }

    return (
      isMatch(formula.resultItem.name) ||
      isMatch(formula.resultItem.attributes_description) ||
      formula.materials.some((material) => isMatch(material.name)) ||
      isMatch(formula.specialtyCook?.name) ||
      isMatch(formula.specialtyItem?.attributes_description)
    )
  }

  const toggleShowTotalMats = (show: boolean) => {
    setShowTotalMats(show);
  }
  const toggleDisablePurchasableCookingMaterials = (show: boolean) => {
    setDisablePurchasableCookingMaterials(show);
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
        retMaterials[material.name] = { ...material };
      }
    }

    return Object.values(retMaterials);
  }

  let filteredFormulas = baseFilteredFormulas
    .filter((formula) => !displayedCategory.size || displayedCategory.has(formula.type))
    .filter((formula) => formula.formulaType !== 3) // 3 === Synthesis Conversion Materials
    .filter((formula) => !displayedRarity.size || displayedRarity.has(formula.resultItem.rarity))
    .filter((formula) => !formula.typeId || (!displayedDishCategory.size || displayedDishCategory.has(formula.typeId)));

  if (showTotalMats) {
    filteredFormulas = filteredFormulas.map((formula) => ({
      ...formula,
      materials: reduceMaterials(
        formula.materials.flatMap((material) => getBaseMaterials(material))
      ),
    }));
  }
  if (disablePurchasableCookingMaterials) {
    filteredFormulas = filteredFormulas
      .filter((formula) => !formula.materials.some((material) => COOKING_MATERIAL_LIST.includes(material.name)));
  }
  filteredFormulas = filteredFormulas
    .filter((formula) => !searchQuery || searchQueryPredicate(searchQuery, formula));

  const pageSize = 20;
  const totalPages = Math.ceil(filteredFormulas.length / pageSize);
  const totalResults = filteredFormulas.length;
  filteredFormulas = filteredFormulas.slice(pageSize * displayedPage, pageSize * (displayedPage + 1));

  const setPage = (page: number) => {
    setDisplayedPage(page);
  }
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-2">

        <div className="flex flex-row gap-2 justify-center items-center">
          <div className="flex whitespace-nowrap">
            {totalResults} results
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>
        {totalPages > 1 && (
          <div className="flex flex-row gap-2 justify-center">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Toggle
                key={idx}
                pressed={displayedPage === idx}
                onPressedChange={() => setPage(idx)}
              >
                {idx + 1}
              </Toggle>
            ))}
          </div>
        )}
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1">
            {/* Displayed Category */}
            <Toggle pressed={displayedCategory.size === 0} onPressedChange={() => setCategory(null)}>All</Toggle>
            <Toggle pressed={displayedCategory.has(ERecipeType.synthesis)} onPressedChange={() => setCategory(ERecipeType.synthesis)}>Synthesis</Toggle>
            <Toggle pressed={displayedCategory.has(ERecipeType.dish)} onPressedChange={() => setCategory(ERecipeType.dish)}>Dish</Toggle>
            <Toggle pressed={displayedCategory.has(ERecipeType.processed)} onPressedChange={() => setCategory(ERecipeType.processed)}>Processed</Toggle>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1">
            {/* Displayed Rarity */}
            <Toggle pressed={displayedRarity.size === 0} onPressedChange={() => toggleRarity(null)}>All</Toggle>
            <Toggle pressed={displayedRarity.has(1)} onPressedChange={() => toggleRarity(1)}>1*</Toggle>
            <Toggle pressed={displayedRarity.has(2)} onPressedChange={() => toggleRarity(2)}>2*</Toggle>
            <Toggle pressed={displayedRarity.has(3)} onPressedChange={() => toggleRarity(3)}>3*</Toggle>
            <Toggle pressed={displayedRarity.has(4)} onPressedChange={() => toggleRarity(4)}>4*</Toggle>
            <Toggle pressed={displayedRarity.has(5)} onPressedChange={() => toggleRarity(5)}>5*</Toggle>
          </div>
        </div>
        {(displayedCategory.has(ERecipeType.dish) || !displayedCategory.size) && (
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-1">
              {/* Displayed Dish Category */}
              <Toggle pressed={displayedDishCategory.size === 0} onPressedChange={() => setDishCategory(null)}>All</Toggle>
              <Toggle pressed={displayedDishCategory.has(EDishType.offensive)} onPressedChange={() => setDishCategory(EDishType.offensive)}>Offensive</Toggle>
              <Toggle pressed={displayedDishCategory.has(EDishType.defensive)} onPressedChange={() => setDishCategory(EDishType.defensive)}>Defensive</Toggle>
              <Toggle pressed={displayedDishCategory.has(EDishType.exploration)} onPressedChange={() => setDishCategory(EDishType.exploration)}>Exploration</Toggle>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1">
            {/* Toggle buttons */}
            <Toggle pressed={showTotalMats} onPressedChange={() => toggleShowTotalMats(!showTotalMats)}>
              Show Total Materials
            </Toggle>
            <Toggle pressed={disablePurchasableCookingMaterials} onPressedChange={() => toggleDisablePurchasableCookingMaterials(!disablePurchasableCookingMaterials)}>
              Disable Purchasable Cooking Materials
            </Toggle>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center m-auto gap-4 w-[800px]">
        {/* <VirtualizedRecipeList
          filteredFormulas={filteredFormulas}
          baseFilteredFormulas={baseFilteredFormulas}
        /> */}
        {filteredFormulas.map((item) => (
          <RecipeRowComponent
            key={item.id}
            item={item}
            baseFilteredFormulas={baseFilteredFormulas}
          />
        ))}
      </div>
    </div >
  );
}