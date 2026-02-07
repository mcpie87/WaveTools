import { DbMapData } from "@/types/mapTypes";
import { TranslationMapEntry } from "../TranslationMaps/TranslationMapInterface";
import { translateBlueprint } from "../BlueprintTranslationService";

interface CategoryPaneComponentProps {
  title: string;
  categories: [string, number][];
  translationMap?: Record<string, TranslationMapEntry>;
  toggleCategory: (category: string) => void;
  showDescriptions: boolean;
  dbMapData: DbMapData;
}
export const CategoryPaneComponent = ({
  title,
  categories,
  translationMap,
  toggleCategory,
  showDescriptions,
  dbMapData,
}: CategoryPaneComponentProps) => {
  if (!categories.length) return null;

  const sortedCategories = translationMap
    ? categories.sort(
      (a, b) =>
        translationMap[a[0]]?.name.localeCompare(translationMap[b[0]]?.name) || 0
    )
    : categories.sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div key={title} className="mb-4">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-1 gap-2">
        {sortedCategories.map(([category, count]) => (
          <label
            key={category}
            className="flex items-center justify-between p-2 bg-base-200 rounded-md hover:bg-base-300 transition-colors"
          >
            {/* Left: Checkbox + Name */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!dbMapData.visibleCategories[category]}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 rounded border-gray-400 accent-blue-500"
              />
              <div className="flex flex-col">
                <span className="text-sm">{translationMap?.[category]?.name ?? category}</span>
                {showDescriptions && (
                  <div className="text-xs  mt-0.5">
                    <div>BlueprintType: <span className="font-mono">{category}</span></div>
                    <div>Translation: {translateBlueprint(category)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Count */}
            <div className="text-sm text-gray-600 font-semibold">({count})</div>
          </label>
        ))}
      </div>
    </div>
  )
}