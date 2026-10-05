import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export const CommentInput = ({ value, onCommit }: { value: string; onCommit: (val: string) => void }) => {
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue] = useDebounce(localValue, 500);

  useEffect(() => {
    onCommit(debouncedValue);
  }, [debouncedValue, onCommit]);

  return (
    <Input
      type="text"
      placeholder="Comment"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      className="min-w-48"
    />
  );
};