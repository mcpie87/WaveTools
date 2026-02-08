import { DbMapData } from "@/types/mapTypes";
import { TranslationMapEntry } from "../TranslationMaps/TranslationMapInterface";
import { translateBlueprint } from "../BlueprintTranslationService";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const sortedCategories = translationMap
    ? categories.sort((a, b) =>
      (translationMap[a[0]]?.name ?? a[0]).localeCompare(
        translationMap[b[0]]?.name ?? b[0]
      )
    )
    : categories.sort((a, b) => a[0].localeCompare(b[0]));

  const toggledCount = categories.filter(c => dbMapData.visibleCategories[c[0]]).length;

  return (
    <div className="mb-4">
      <button
        onClick={() => toggleDisplayedCategoryGroup(title, !isOpen)}
        className="flex items-center justify-between align-center gap-2 text-sm font-semibold mb-2 w-full text-left hover:text-primary transition-colors"
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
            {toggledCount === categories.length ? "Uncheck all" : "Check all"}
          </Button>
        )}
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 gap-2 pl-6">
          {sortedCategories.map(([category, count]) => (
            <label
              key={category}
              className="flex items-center justify-between p-2 bg-base-200 rounded-md hover:bg-base-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!dbMapData.visibleCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 rounded border-gray-400 accent-blue-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm">
                    {translationMap?.[category]?.name ?? category}
                  </span>
                  {showDescriptions && (
                    <div className="text-xs mt-0.5">
                      <div>
                        BlueprintType: <span className="font-mono">{category}</span>
                      </div>
                      <div>Translation: {translateBlueprint(category)}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600 font-semibold">({count})</div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};