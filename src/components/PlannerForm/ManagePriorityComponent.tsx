import { ModalComponent } from "./ModalComponent";
import React, { useState } from "react";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { IResonatorPlanner, IWeaponPlanner } from "@/app/interfaces/planner_item";

interface ManagePriorityComponentProps {
  plannerItems: (IResonatorPlanner | IWeaponPlanner)[];
  onDragAndDrop: (target: IResonatorPlanner | IWeaponPlanner, newPriority: number) => void;
  showForm: boolean;
  onClose: () => void;
}
export const ManagePriorityComponent = ({
  plannerItems,
  onDragAndDrop,
  showForm,
  onClose,
}: ManagePriorityComponentProps) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

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
    const draggedItem = plannerItems[draggedItemIndex];
    onDragAndDrop(draggedItem, dropIndex + 1);
    setDraggedItemIndex(null);
  };

  return (
    <ModalComponent show={showForm} onClose={onClose}>
      <div>
        <div className="text-center text-3xl">Manage Priority</div>
        <div className="text-center">Drag to change order</div>
        <div className="flex flex-col flex-wrap">
          {plannerItems.map((plannerItem, idx) => (
            <div
              key={idx}
              className={`
              ${plannerItem.rarity === 5 ? "bg-rarity5" : "bg-rarity4"}
              flex flex-row items-center justify-start border w-80 h-11 gap-1
              cursor-move transition-all duration-300 ease-in-out
              ${draggedItemIndex === idx ? "opacity-50" : ""}
            `}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
            >
              <div className="w-10 text-center">{plannerItem.priority}</div>
              <Image
                src={`${convertToUrl(plannerItem.icon)}`}
                alt={`${plannerItem.name} icon`}
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div>{plannerItem.name}</div>
            </div>
          ))}
        </div>
      </div>
    </ModalComponent>
  )
}