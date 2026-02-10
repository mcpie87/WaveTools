import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

interface DevModeSettingsComponentProps {
  coords: { x: number; y: number; z: number };
  setCoords: (coords: React.SetStateAction<{ x: number; y: number; z: number }>) => void;
  radius: number;
  setRadius: (radius: number) => void;
  showDescriptions: boolean;
  setShowDescriptions: (v: boolean) => void;
  enableClick: boolean;
  setEnableClick: (v: boolean) => void;
};
export const DevModeSettingsComponent = ({
  coords,
  setCoords,
  radius,
  setRadius,
  showDescriptions,
  setShowDescriptions,
  enableClick,
  setEnableClick,
}: DevModeSettingsComponentProps) => {
  const handleDevModeClick = () => {
    setShowDescriptions(!showDescriptions);
    setEnableClick(false);
  };
  return (
    <>
      <div className="rounded-lg border p-3 space-y-2 bg-base-200">
        <div className="flex flex-col gap-2">
          <Toggle pressed={showDescriptions} onPressedChange={handleDevModeClick}>
            Turn on Dev Mode
          </Toggle>

          {showDescriptions && (
            <div className="rounded-lg border p-3 space-y-2 bg-base-200">
              <h3 className="text-sm font-semibold">Selection</h3>
              <Label>Coords</Label>
              <div className="flex gap-2">
                {(['x', 'y', 'z'] as const).map(k => (
                  <Input
                    key={k}
                    type="number"
                    value={coords[k]}
                    onChange={e => setCoords(c => ({ ...c, [k]: +e.target.value }))}
                  />
                ))}
              </div>

              <Label>Radius</Label>
              <Input type="number" value={radius} onChange={e => setRadius(+e.target.value)} />

              <div className="flex flex-col gap-2">
                <Toggle pressed={enableClick} onPressedChange={setEnableClick}>
                  Click to Investigate
                </Toggle>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
};