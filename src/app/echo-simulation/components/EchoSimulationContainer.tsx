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
    <div className="flex flex-col">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(650px,1fr))] gap-2">
        {components.map(component => (
          <div key={component.id} className="m-10 border p-3">
            <EchoSimulationComponent />
            <Button onClick={() => removeComponent(component.id)}>Remove</Button>
          </div>
        ))}
      </div>
      <Button onClick={addComponent} className="m-10 p-3">Add</Button>
    </div>
  );
}

export default EchoSimulationContainer;