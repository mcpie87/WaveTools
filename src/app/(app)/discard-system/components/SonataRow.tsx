import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { SonataKey, EchoCost, MainStat, DbDiscardSystem } from "@/types/discardSystemTypes";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { memo } from "react";
import { CommentInput } from "./CommentInput";

export const SonataRow = memo(({
  sonataKey,
  name,
  icon,
  allStats,
  sonataData,
  onToggle,
  onCommentChange,
}: {
  sonataKey: SonataKey;
  name: string;
  icon: string;
  allStats: { cost: EchoCost; stat: MainStat }[];
  sonataData: DbDiscardSystem[SonataKey];
  onToggle: (sonata: SonataKey, cost: EchoCost, stat: MainStat) => void;
  onCommentChange: (val: string) => void;
}) => {
  return (
    <TableRow>
      <TableCell className="border">
        <Image className="min-w-5" src={convertToUrl(icon)} alt={name} width={20} height={20} />
      </TableCell>
      <TableCell className="border px-3 py-1 whitespace-nowrap">{name}</TableCell>

      {allStats.map(({ cost, stat }) => {
        const isChecked = !!sonataData?.[cost]?.has(stat as never);
        return (
          <TableCell key={`${cost}_${stat}`} className="border text-center px-2 py-1">
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => onToggle(sonataKey, cost, stat)}
              className="mx-auto"
            />
          </TableCell>
        );
      })}

      <TableCell className="min-w-48">
        <CommentInput value={sonataData?.comment ?? ''} onCommit={onCommentChange} />
      </TableCell>
    </TableRow>
  );
});
SonataRow.displayName = 'SonataRow';