import { InputEntry } from "@/types/resonatorTypes"

interface PlannerCardCurrentDesiredComponentProps<T> {
  label: string,
  currentDesired: InputEntry<T>
}
export function PlannerCardCurrentDesiredComponent<T>({
  label,
  currentDesired
}: PlannerCardCurrentDesiredComponentProps<T>) {
  const { current, desired } = currentDesired ?? {};
  return (
    <div className="flex flex-row justify-between">
      <div>{current as string} → {desired as string}</div>
      <div>{label}</div>
    </div>
  )
}