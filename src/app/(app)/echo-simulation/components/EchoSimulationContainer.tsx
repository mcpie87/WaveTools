import { useState } from "react";
import EchoSimulationComponent from "./EchoSimulationComponent";
import { Button } from "@/components/ui/button";

function EchoSimulationContainer() {
  const [components, setComponents] = useState<{ id: number }[]>([{ id: 1 }]);

  const addComponent = () => {
    setComponents(prev => [...prev, { id: prev.length + 1 }]);
  };

  const removeComponent = (id: number) => {
    setComponents(prev => prev.filter(component => component.id !== id));
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="grid place-items-center grid-cols-[repeat(auto-fit,minmax(650px,1fr))] gap-4">
        {components.map(component => (
          <div key={component.id} className="bg-base-200 rounded-md flex flex-col gap-2 p-2">
            <EchoSimulationComponent />
            <Button
              onClick={() => removeComponent(component.id)}
              variant="destructive"
              className="w-full"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center">
        <Button onClick={addComponent} className="w-[535px]">Add</Button>
      </div>
    </div>
  );
}

export default EchoSimulationContainer;