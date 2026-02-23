'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SONATAS } from "@/constants/sonatas";
import LocalStorageService from "@/services/LocalStorageService";
import { DbDiscardSystem, EchoCost, MainStat, MainStat1Cost, MainStat3Cost, MainStat4Cost, SonataKey } from "@/types/discardSystemTypes";
import { LocalStorageKey } from "@/types/localStorageTypes";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

const storageService = new LocalStorageService(LocalStorageKey.ECHO_DISCARD_SYSTEM);

const MAIN_STATS: Record<EchoCost, MainStat[]> = {
  [EchoCost.COST1]: [MainStat1Cost.ATK, MainStat1Cost.DEF, MainStat1Cost.HP],
  [EchoCost.COST3]: [
    MainStat3Cost.ATK, MainStat3Cost.DEF, MainStat3Cost.HP,
    MainStat3Cost.Spectro, MainStat3Cost.Havoc, MainStat3Cost.Aero,
    MainStat3Cost.Fusion, MainStat3Cost.Electro, MainStat3Cost.Glacio, MainStat3Cost.ER,
  ],
  [EchoCost.COST4]: [
    MainStat4Cost.ATK, MainStat4Cost.DEF, MainStat4Cost.HP,
    MainStat4Cost.CR, MainStat4Cost.CDmg, MainStat4Cost.Heal,
  ],
};

const initDb = (): DbDiscardSystem => {
  return Object.fromEntries(
    Object.keys(SONATAS).map(key => [
      key,
      {
        [EchoCost.COST1]: new Set<MainStat1Cost>(),
        [EchoCost.COST3]: new Set<MainStat3Cost>(),
        [EchoCost.COST4]: new Set<MainStat4Cost>(),
      },
    ])
  ) as DbDiscardSystem;
};


const CommentInput = ({ value, onCommit }: { value: string; onCommit: (val: string) => void }) => {
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

export default function DiscardSystem() {
  const [sonataDb, setSonataDb] = useState<DbDiscardSystem>(() => {
    return (storageService.load() as DbDiscardSystem) ?? initDb();
  });

  useEffect(() => {
    storageService.save(sonataDb);
  }, [sonataDb]);

  const allStats = useMemo(() => {
    return Object.entries(MAIN_STATS).flatMap(([cost, stats]) =>
      stats.map(stat => ({ cost: cost as EchoCost, stat }))
    );
  }, []);

  const toggle = (sonata: SonataKey, cost: EchoCost, stat: MainStat) => {
    setSonataDb(prev => {
      const existing = prev[sonata]?.[cost] as Set<MainStat> | undefined;
      const newSet = new Set(existing);
      if (newSet.has(stat)) {
        newSet.delete(stat);
      } else {
        newSet.add(stat as never);
      }
      return {
        ...prev,
        [sonata]: {
          ...prev[sonata],
          [cost]: newSet,
        },
      };
    });
  };

  const handleCommentChange = useMemo(() => {
    const cache: Partial<Record<SonataKey, (val: string) => void>> = {};
    return (sonataKey: SonataKey) => {
      if (!cache[sonataKey]) {
        cache[sonataKey] = (value: string) => {
          setSonataDb(prev => ({
            ...prev,
            [sonataKey]: {
              ...prev[sonataKey],
              comment: value,
            },
          }));
        };
      }
      return cache[sonataKey]!;
    };
  }, []);

  const columnTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    for (const sonataKey of Object.keys(SONATAS) as SonataKey[]) {
      for (const { cost, stat } of allStats) {
        const key = `${cost}_${stat}`;
        if (sonataDb[sonataKey]?.[cost]?.has(stat as never)) {
          totals[key] = (totals[key] || 0) + 1;
        }
      }
    }

    return totals;
  }, [sonataDb, allStats]);

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-xl font-semibold mb-4">Discard System</h1>

      <Table className="border-collapse text-sm">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} colSpan={2}>
              Name
            </TableHead>
            <TableHead colSpan={MAIN_STATS[EchoCost.COST1].length}>
              1 Cost
            </TableHead>
            <TableHead colSpan={MAIN_STATS[EchoCost.COST3].length}>
              3 Cost
            </TableHead>
            <TableHead colSpan={MAIN_STATS[EchoCost.COST4].length}>
              4 Cost
            </TableHead>
          </TableRow>

          <TableRow>
            {allStats.map(({ cost, stat }) => (
              <TableHead key={`${cost}_${stat}`}>
                {stat}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Object.entries(SONATAS).map(([key, { name, icon }]) => (
            <TableRow key={key}>
              <TableCell className="border">
                <Image
                  className="min-w-5"
                  src={convertToUrl(icon)}
                  alt={name}
                  width={20}
                  height={20}
                />
              </TableCell>
              <TableCell className="border px-3 py-1 whitespace-nowrap">
                {name}
              </TableCell>

              {allStats.map(({ cost, stat }) => {
                const isChecked = !!sonataDb[key as SonataKey]?.[cost]?.has(stat as never);

                return (
                  <TableCell key={`${cost}_${stat}`} className="border text-center px-2 py-1">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggle(key as SonataKey, cost, stat)}
                      className="mx-auto"
                    />
                  </TableCell>
                );
              })}

              <TableCell className="min-w-48">
                <CommentInput
                  value={sonataDb[key as SonataKey]?.comment ?? ''}
                  onCommit={handleCommentChange(key as SonataKey)}
                />
              </TableCell>
            </TableRow>
          ))}

          <TableRow className="font-semibold">
            <TableCell colSpan={2} className="border px-3 py-1">Total</TableCell>
            {allStats.map(({ cost, stat }) => {
              const key = `${cost}_${stat}`;
              return (
                <TableCell key={key} className="border text-center px-2 py-1">
                  {columnTotals[key] || 0}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}