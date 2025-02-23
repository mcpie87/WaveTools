import { useState } from "react";
import EchoSimulationComponent from "./EchoSimulationComponent";

function EchoSimulationContainer() {
  const [components, setComponents] = useState<{ id: number }[]>([{ id: 1 }]);

  const addComponent = () => {
    setComponents(prev => [...prev, { id: prev.length + 1 }]);
  };

  const removeComponent = (id: number) => {
    setComponents(prev => prev.filter(component => component.id !== id));
  };

  return (
    <div className="flex flex-wrap">
      {components.map(component => (
        <div key={component.id} className="m-10 border p-3">
          <EchoSimulationComponent />
          <button onClick={() => removeComponent(component.id)}>Remove</button>
        </div>
      ))}
      <button onClick={addComponent} className="m-10 p-3">Add</button>
    </div>
  );
}

export default EchoSimulationContainer;