import { ResonatorDBSchema, ResonatorStateDBEntry } from "@/types/resonatorTypes"
import { ModalComponent } from "./ModalComponent";
import { useEffect, useState } from "react";

interface ManagePriorityComponentProps {
  resonators: ResonatorDBSchema;
  onClose: () => void;
  showForm: boolean;
}
export const ManagePriorityComponent = ({
  resonators,
  onClose,
  showForm
}: ManagePriorityComponentProps) => {
  const [displayedResonators, setDisplayedResonators] = useState<ResonatorStateDBEntry[]>([]);

  useEffect(() => {
    setDisplayedResonators(
      Object.values(resonators)
        .sort((a, b) => a.priority - b.priority)
    );
  }, [resonators])

  console.log("ManagePrio", displayedResonators);
  return (
    <ModalComponent show={showForm} onClose={onClose}>
      <div>
        <div className="text-3xl">
          Manage Priority
        </div>
        <div className="flex flex-col flex-wrap">
          {displayedResonators.map((resonator, idx) => (
            <div key={idx} className={`border w-[200px]`}>
              {resonator.name}
            </div>
          ))}
        </div>
      </div>
    </ModalComponent>
  )
}