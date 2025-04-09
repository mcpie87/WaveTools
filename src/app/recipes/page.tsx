'use client';

import { useData } from "@/context/DataContext";
import { convertCostListToItemList } from "@/utils/items_utils";
import { useEffect, useState } from "react";
import { IAPIItem } from "../interfaces/api_interfaces";
// import { FixedSizeList, ListChildComponentProps } from "react-window";
import { EDishType, ERecipeType, IAPIRecipeFormula, IItemToShops, IRecipeFormula, IRecipeItem } from "./RecipeTypes";
import { RecipeRowComponent } from "./components/RecipeRowComponent";

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
    if (!query) return true;
    const isNameMatch = formula.resultItem.name.toLowerCase().includes(query.toLowerCase());
    const isDescriptionMatch = formula.resultItem.attributes_description.toLowerCase().includes(query.toLowerCase());
    if (isNameMatch || isDescriptionMatch) return true;
    const isMaterialMatch = formula.materials
      .some((material) => material.name.toLowerCase().includes(query.toLowerCase()));
    if (isMaterialMatch) return true;

    return false;
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
    .filter((formula) => formula.typeId && (!displayedDishCategory.size || displayedDishCategory.has(formula.typeId)));

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

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex flex-row gap-2">
          <div>
            {filteredFormulas.length} results
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1">
            {/* Displayed Category */}
            <button className={`btn ${displayedCategory.size === 0 ? "active" : ""}`} onClick={() => setCategory(null)}>All</button>
            <button className={`btn ${displayedCategory.has(ERecipeType.synthesis) ? "active" : ""}`} onClick={() => setCategory(ERecipeType.synthesis)}>Synthesis</button>
            <button className={`btn ${displayedCategory.has(ERecipeType.dish) ? "active" : ""}`} onClick={() => setCategory(ERecipeType.dish)}>Dish</button>
            <button className={`btn ${displayedCategory.has(ERecipeType.processed) ? "active" : ""}`} onClick={() => setCategory(ERecipeType.processed)}>Processed</button>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1">
            {/* Dish category */}
            <button className={`btn ${displayedDishCategory.size === 0 ? "active" : ""}`} onClick={() => setDishCategory(null)}>All</button>
            <button className={`btn ${displayedDishCategory.has(EDishType.offensive) ? "active" : ""}`} onClick={() => setDishCategory(EDishType.offensive)}>Offensive</button>
            <button className={`btn ${displayedDishCategory.has(EDishType.defensive) ? "active" : ""}`} onClick={() => setDishCategory(EDishType.defensive)}>Defensive</button>
            <button className={`btn ${displayedDishCategory.has(EDishType.exploration) ? "active" : ""}`} onClick={() => setDishCategory(EDishType.exploration)}>Exploration</button>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1">
            {/* Displayed Rarity */}
            <button className={`btn ${displayedRarity.has(1) ? "active" : ""}`} onClick={() => toggleRarity(1)}>1</button>
            <button className={`btn ${displayedRarity.has(2) ? "active" : ""}`} onClick={() => toggleRarity(2)}>2</button>
            <button className={`btn ${displayedRarity.has(3) ? "active" : ""}`} onClick={() => toggleRarity(3)}>3</button>
            <button className={`btn ${displayedRarity.has(4) ? "active" : ""}`} onClick={() => toggleRarity(4)}>4</button>
            <button className={`btn ${displayedRarity.has(5) ? "active" : ""}`} onClick={() => toggleRarity(5)}>5</button>
            <button className={`btn ${displayedRarity.size === 0 ? "active" : ""}`} onClick={() => toggleRarity(null)}>All</button>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1">
            {/* Toggle buttons */}
            <button
              className={`btn ${showTotalMats ? "active" : ""}`}
              onClick={() => toggleShowTotalMats(!showTotalMats)}
            >
              Show Total Materials
            </button>
            <button
              className={`btn ${disablePurchasableCookingMaterials ? "active" : ""}`}
              onClick={() => toggleDisablePurchasableCookingMaterials(!disablePurchasableCookingMaterials)}
            >
              Disable Purchasable Cooking Materials
            </button>
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