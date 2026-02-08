import { DbMapData } from "@/types/mapTypes";
import { TranslationMapEntry } from "../TranslationMaps/TranslationMapInterface";
import { translateBlueprint } from "../BlueprintTranslationService";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import clsx from "clsx";

interface CategoryPaneGroupComponentProps {
  groupName: string;
  categories: [string, number][];
  showDescriptions: boolean;
  toggleCategory: (category: string) => void;
  toggleCategories?: (categories: string[], value: boolean) => void;
  dbMapData: DbMapData;
};
const CategoryPaneGroupComponent = ({
  groupName,
  categories,
  showDescriptions,
  toggleCategory,
  toggleCategories,
  dbMapData,
}: CategoryPaneGroupComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalCount = categories.reduce((sum, [, c]) => sum + c, 0);
  const allChecked = categories.every(([t]) => dbMapData.visibleCategories[t]);
  const someChecked = categories.some(([t]) => dbMapData.visibleCategories[t]);

  return (
    <>
      <button
        className={clsx(
          "flex flex-col pl-1 text-left rounded-md hover:bg-base-300 transition-colors",
          allChecked ? "bg-base-300" : (someChecked ? "bg-base-200" : "")
        )}
        onClick={() => {
          if (!toggleCategories) {
            toggleCategory(groupName);
            return;
          }
          if (allChecked) {
            toggleCategories?.(categories.map(([t]) => t), false);
          } else {
            toggleCategories?.(categories.map(([t]) => t), true);
          }
        }}
      >
        {/* Title */}
        <div
          className="flex flex-row items-center justify-between p-1 w-full"
        >
          <div>{groupName}</div>
          <div className="flex flex-row gap-2 items-center">
            <div>({totalCount})</div>
            {toggleCategories && (
              <Button className="flex" onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen)
              }}>
                {isOpen ? "−" : "+"}
              </Button>
            )}
          </div>
        </div>
        {/* Translation if showDescriptions */}
        {showDescriptions && !toggleCategories && (
          <div className="text-xs text-gray-600 font-semibold">
            Translation: {translateBlueprint(groupName)}
          </div>
        )}
      </button>
      {isOpen && toggleCategories && (
        categories.map(([category, count]) => (
          <button
            key={category}
            className="flex flex-col flex-wrap items-center justify-between gap-2 text-xs font-mono hover:bg-base-300 transition-colors"
            onClick={() => toggleCategory(category)}
          >
            <div className="flex w-full justify-between">
              <div className="flex flex-row gap-2">
                <input type="checkbox" key={category} checked={!!dbMapData.visibleCategories[category]} />
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-gray-400">{category}</span>
                  {showDescriptions && (
                    <span className="text-xs text-gray-600">
                      Translation: {translateBlueprint(category)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap align-center justify-between">({count})</div>
            </div>
          </button>
        ))
      )
      }
    </>
  );
};

interface CategoryPaneComponentProps {
  title: string;
  categories: [string, number][];
  translationMap?: Record<string, TranslationMapEntry>;
  toggleCategory: (category: string) => void;
  toggleCategories?: (categories: string[], value: boolean) => void;
  toggleDisplayedCategoryGroup: (categoryGroup: string, value: boolean) => void;
  showDescriptions: boolean;
  dbMapData: DbMapData;
  isOpen: boolean;
}
export const CategoryPaneComponent = ({
  title,
  categories,
  translationMap,
  toggleCategory,
  toggleCategories,
  toggleDisplayedCategoryGroup,
  showDescriptions,
  dbMapData,
  isOpen,
}: CategoryPaneComponentProps) => {
  if (!categories.length) return null;

  const groups = new Map<string, [string, number][]>();
  if (toggleCategories) {
    for (const [blueprintType, count] of categories) {
      const displayName = translationMap?.[blueprintType]?.name ?? blueprintType;
      if (!groups.has(displayName)) groups.set(displayName, []);
      groups.get(displayName)!.push([blueprintType, count]);
    }
  }
  else {
    for (const [blueprintType, count] of categories) {
      groups.set(blueprintType, [[blueprintType, count]]);
    }
  }

  const sortedGroupNames = [...groups.keys()].sort((a, b) => a.localeCompare(b));
  const toggledCount = categories.filter(c => dbMapData.visibleCategories[c[0]]).length;

  return (
    <div className="mb-4">
      {/* Title */}
      <button
        onClick={() => toggleDisplayedCategoryGroup(title, !isOpen)}
        className="flex items-center justify-between gap-2 text-sm font-semibold mb-2 w-full text-left hover:text-primary transition-colors"
      >
        <div className="flex items-center gap-1">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {showDescriptions && (
            <div>({categories.length})</div>
          )}
          <span>{title}</span>
        </div>
        {isOpen && toggleCategories && (
          <Button
            className="flex-end"
            onClick={(e) => {
              e.stopPropagation();
              toggleCategories(categories.map(c => c[0]), !toggledCount);
            }}
          >
            {toggledCount > 0 ? "Uncheck all" : "Check all"}
          </Button>
        )}
      </button>

      {/* Groups */}
      {isOpen && (
        <div className="grid grid-cols-1 gap-2 pl-1">
          {sortedGroupNames.map((groupName) => (
            <CategoryPaneGroupComponent
              key={groupName}
              groupName={groupName}
              categories={groups.get(groupName)!}
              showDescriptions={showDescriptions}
              toggleCategory={toggleCategory}
              toggleCategories={toggleCategories}
              dbMapData={dbMapData}
            />
          )
          )}
        </div>
      )}
    </div>
  );
};