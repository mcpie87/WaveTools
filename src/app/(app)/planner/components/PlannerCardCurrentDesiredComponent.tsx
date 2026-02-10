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

  const renderCurrentDesired = () => {
    if (current === desired) {
      return (<span>{current as string}</span>);
    }
    return (
      <span>{current as string} → {desired as string}</span>
    )
  }

  return (
    <div className="flex flex-row justify-between gap-1">
      <div>{renderCurrentDesired()}</div>
      <div>{label}</div>
    </div>
  )
}