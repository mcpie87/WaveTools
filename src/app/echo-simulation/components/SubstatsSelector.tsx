import React from "react";
import { SUBSTATS, SubstatEntry, substatValues, SubstatName, SubstatValue, substatsDisplayOrder } from "../services/simulate";
import { formatSubstatValue } from "../utils/utils";

const generateAvailableSubstats = (pickedSubstats: SubstatEntry[], value: SubstatName): SubstatName[] => {
  const pickedSubstatNames: SubstatName[] = pickedSubstats.map(e => e.name);
  return [
    ...SUBSTATS.filter((substat) => !pickedSubstatNames.includes(substat) || substat === value)
  ].sort((a, b) => substatsDisplayOrder[a] - substatsDisplayOrder[b]);
};

interface MultiSelectorProps {
  selectedSubstats: SubstatEntry[];
  selectedSubstatsSetter: (substats: SubstatEntry[]) => void;
  renderValues?: boolean;
}

const SubstatsSelector: React.FC<MultiSelectorProps> = ({
  selectedSubstats,
  selectedSubstatsSetter,
  renderValues = false
}) => {
  const handleSubstatChange = (index: number, value: SubstatName, substatValue: SubstatValue) => {
    const updatedSubstats = [...selectedSubstats];
    updatedSubstats[index] = {
      name: value,
      value: substatValue
    }
    selectedSubstatsSetter(updatedSubstats);
  };

  const addRow = () => {
    if (selectedSubstats.length < 5) {
      selectedSubstatsSetter([...selectedSubstats, { name: "", value: 0 }]);
    }
  };

  const removeRow = (index: number) => {
    selectedSubstatsSetter(selectedSubstats.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {selectedSubstats.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <select
            value={option.name}
            onChange={(e) => handleSubstatChange(index, e.target.value as SubstatName, 0)}
            className="border border-gray-300 rounded-md p-2 w-48"
          >
            <option value="">
              Select an option
            </option>
            {generateAvailableSubstats(selectedSubstats, option.name).map((substat) => (
              <option key={substat} value={substat}>
                {substat}
              </option>
            ))}
          </select>
          {renderValues && option.name &&
            <>
              <span>{">="}</span>
              <select
                value={option.value}
                onChange={(e) => handleSubstatChange(index, option.name, Number(e.target.value) as SubstatValue)}
                className="border border-gray-300 rounded-md p-2 w-48"
              >
                <option value={0}>
                  Select an option
                </option>
                {substatValues[option.name].map((substatValue) => (
                  <option key={substatValue} value={substatValue}>
                    {formatSubstatValue(substatValue)}
                  </option>
                ))}
              </select>
            </>
          }
          <button
            type="button"
            onClick={() => removeRow(index)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
      {selectedSubstats.length < 5 && (
        <button
          type="button"
          onClick={addRow}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default SubstatsSelector;
