import React from "react";
import { SUBSTATS, SubstatEntry, substatValues, SubstatName, SubstatValue, substatsDisplayOrder } from "../services/simulate";
import { formatSubstatValue } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          <Select
            value={option.name}
            onValueChange={(value) => handleSubstatChange(index, value as SubstatName, 0)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a substat" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {generateAvailableSubstats(selectedSubstats, option.name).map((substat) => (
                  <SelectItem key={substat} value={substat}>
                    {substat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {renderValues && option.name &&
            <>
              <span>{">="}</span>
              <Select
                value={option.value.toString()}
                onValueChange={(value) => handleSubstatChange(index, option.name, Number(value) as SubstatValue)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a substat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"0"}>
                      Select a value
                    </SelectItem>
                    {substatValues[option.name].map((substatValue) => (
                      <SelectItem key={substatValue} value={substatValue.toString()}>
                        {formatSubstatValue(substatValue)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </>
          }
          <Button type="button" onClick={() => removeRow(index)}>
            Delete
          </Button>
        </div>
      ))}
      {selectedSubstats.length < 5 && (
        <Button
          type="button"
          onClick={addRow}
        >
          Add
        </Button>
      )}
    </div>
  );
};

export default SubstatsSelector;
