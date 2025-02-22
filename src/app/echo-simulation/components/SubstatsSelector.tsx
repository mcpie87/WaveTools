import React from "react";
import { SUBSTATS, Substat } from "../services/simulate";

const generateAvailableSubstats = (pickedSubstats: Substat[], value: Substat): Substat[] => {
  return [
    ...SUBSTATS.filter((substat) => !pickedSubstats.includes(substat) || substat === value)
  ].sort();
};

interface MultiSelectorProps {
  selectedSubstats: Substat[];
  selectedSubstatsSetter: (substats: Substat[]) => void;
}

const SubstatsSelector: React.FC<MultiSelectorProps> = ({ selectedSubstats, selectedSubstatsSetter }) => {
  const handleSubstatChange = (index: number, value: Substat) => {
    const updatedSubstats = [...selectedSubstats];
    updatedSubstats[index] = value;
    selectedSubstatsSetter(updatedSubstats);
  };

  const addRow = () => {
    if (selectedSubstats.length < 5) {
      selectedSubstatsSetter([...selectedSubstats, ""]); // Ensure valid initial value
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
            value={option}
            onChange={(e) => handleSubstatChange(index, e.target.value as Substat)}
            className="border border-gray-300 rounded-md p-2 w-48"
          >
            <option value="">
              Select an option
            </option>
            {generateAvailableSubstats(selectedSubstats, option).map((substat) => (
              <option key={substat} value={substat}>
                {substat}
              </option>
            ))}
          </select>
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
