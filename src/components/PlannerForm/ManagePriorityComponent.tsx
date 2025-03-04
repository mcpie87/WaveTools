import { ResonatorDBSchema } from "@/types/resonatorTypes"
import { ModalComponent } from "./ModalComponent";
import React, { useEffect, useState } from "react";
import { IAPIResonator } from "@/app/interfaces/api_interfaces";
import { parseResonatorToPlanner } from "@/utils/api_parser";
import { IResonatorPlanner } from "@/app/interfaces/resonator";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";

interface ManagePriorityComponentProps {
  dbResonators: ResonatorDBSchema;
  apiResonators: IAPIResonator[];
  onClose: () => void;
  onDragAndDrop: (name: string, value: number) => void;
  showForm: boolean;
}
export const ManagePriorityComponent = ({
  dbResonators,
  apiResonators,
  onClose,
  onDragAndDrop,
  showForm
}: ManagePriorityComponentProps) => {
  const [displayedResonators, setDisplayedResonators] = useState<IResonatorPlanner[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const priorityResonators = Object.values(dbResonators)
      .map(dbResonator => {
        const matchingApiResonator = apiResonators.find(e => e.name === dbResonator.name);
        if (!matchingApiResonator) {
          console.error(`Matching API Resonator not found ${dbResonator.name}`);
          return undefined;
        }
        return parseResonatorToPlanner(matchingApiResonator, dbResonator);
      })
      .filter(Boolean) as IResonatorPlanner[];

    setDisplayedResonators(
      priorityResonators
        .sort((a, b) => a.priority - b.priority)
    );
  }, [dbResonators, apiResonators])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) {
      return;
    }
    const newDisplayedResonators = [...displayedResonators];
    const draggedItem = newDisplayedResonators[draggedItemIndex];

    newDisplayedResonators.splice(draggedItemIndex, 1);
    newDisplayedResonators.splice(dropIndex, 0, draggedItem);

    setDisplayedResonators(newDisplayedResonators);
    onDragAndDrop(draggedItem.name, dropIndex);
    setDraggedItemIndex(null);
  };

  return (
    <ModalComponent show={showForm} onClose={onClose}>
      <div>
        <div className="text-center text-3xl">Manage Priority</div>
        <div className="text-center">Drag to change order</div>
        <div className="flex flex-col flex-wrap">
          {displayedResonators.map((resonator, idx) => (
            <div
              key={idx}
              className={`
              ${resonator.rarity === 5 ? "bg-rarity5" : "bg-rarity4"}
              flex flex-row items-center justify-start border w-80 h-11 gap-1
              cursor-move transition-all duration-300 ease-in-out
              ${draggedItemIndex === idx ? "opacity-50" : ""}
            `}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
            >
              <div className="w-10 text-center">{resonator.priority}</div>
              <Image
                src={`${convertToUrl(resonator.icon)}`}
                alt={`${resonator.name} icon`}
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div>{resonator.name}</div>
            </div>
          ))}
        </div>
      </div>
    </ModalComponent>
  )
}