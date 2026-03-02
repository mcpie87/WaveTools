'use client';
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ========================================================================= */
/*                               Core Types                                  */
/* ========================================================================= */

type Policy = Record<number, number>;

interface SolverResult {
  /** Expected tuners spent per successful echo */
  tunerEV: number;
  /** Expected attempts needed per successful echo */
  attemptEV: number;
}

interface PolicyResult {
  policy: Policy;
  tunerEV: number;
  attemptEV: number;
  rank: number;
}

/* ========================================================================= */
/*                              Game Constants                               */
/* ========================================================================= */

const SUBSTAT_POOL = 13;
const TUNER_COST = 10;
const REFUND_RATE = 0.3;
const MAX_LEVEL = 25;

/* ========================================================================= */
/*                         Markov Chain based Solver                         */
/*                          Utilizes renewal theorem                         */
/* ========================================================================= */

interface StateValue {
  eCost: number;
  pWin: number;
}

class MarkovChainSolver {
  private memo = new Map<string, StateValue>();

  constructor(
    private readonly targetStats: number,
    private readonly policy: Policy
  ) { }

  public calculate(): SolverResult {
    this.memo.clear();
    const { eCost, pWin } = this.evaluateState(0, 0);
    return {
      tunerEV: pWin > 0 ? eCost / pWin : Infinity,
      attemptEV: pWin > 0 ? 1 / pWin : Infinity,
    };
  }

  private evaluateState(level: number, hitCount: number): StateValue {
    const key = `${level},${hitCount}`;
    const cached = this.memo.get(key);
    if (cached) return cached;

    const result = this.computeState(level, hitCount);
    this.memo.set(key, result);
    return result;
  }

  private computeState(level: number, hitCount: number): StateValue {
    if (this.shouldDiscard(level, hitCount)) return this.refundValue(level);
    if (hitCount >= this.targetStats) return this.autoCompleteValue(level);
    return this.rollValue(level, hitCount);
  }

  private shouldDiscard(level: number, hitCount: number): boolean {
    const rollsLeft = (MAX_LEVEL - level) / 5;
    return (
      rollsLeft + hitCount < this.targetStats ||
      (level in this.policy && hitCount < this.policy[level])
    );
  }

  private refundValue(level: number): StateValue {
    const spent = (level / 5) * TUNER_COST;
    return { eCost: -(spent * REFUND_RATE), pWin: 0 };
  }

  private autoCompleteValue(level: number): StateValue {
    const rollsLeft = (MAX_LEVEL - level) / 5;
    return { eCost: rollsLeft * TUNER_COST, pWin: 1 };
  }

  private rollValue(level: number, hitCount: number): StateValue {
    const remainingPool = SUBSTAT_POOL - level / 5;
    const hitsNeeded = this.targetStats - hitCount;
    const pHit = hitsNeeded / remainingPool;
    const pMiss = 1 - pHit;

    const hit = this.evaluateState(level + 5, hitCount + 1);
    const miss = this.evaluateState(level + 5, hitCount);

    return {
      eCost: TUNER_COST + pHit * hit.eCost + pMiss * miss.eCost,
      pWin: pHit * hit.pWin + pMiss * miss.pWin,
    };
  }
}

/* ========================================================================= */
/*                           Policy Generator                                */
/* ========================================================================= */

function generateSensiblePolicies(targetStats: number): Policy[] {
  const LEVELS = [5, 10, 15, 20];
  const results: Policy[] = [];

  function backtrack(
    index: number,
    policy: Policy,
    lastRequired: number
  ): void {
    if (index === LEVELS.length) {
      results.push({ ...policy });
      return;
    }

    const level = LEVELS[index];
    const rollsDone = level / 5;
    const rollsRemaining = (MAX_LEVEL - level) / 5;

    backtrack(index + 1, policy, lastRequired);

    const minThreshold =
      Math.max(lastRequired, targetStats - rollsRemaining) + 1;
    const maxThreshold = Math.min(rollsDone, targetStats);

    for (let req = minThreshold; req <= maxThreshold; req++) {
      policy[level] = req;
      backtrack(index + 1, policy, req);
      delete policy[level];
    }
  }

  backtrack(0, {}, 0);
  return results;
}

/* ========================================================================= */
/*                           Computation Layer                               */
/* ========================================================================= */

function computeResults(target: number): PolicyResult[] {
  const policies = generateSensiblePolicies(target);

  const results = policies.map((policy) => {
    const { tunerEV, attemptEV } = new MarkovChainSolver(
      target,
      policy
    ).calculate();
    return { policy, tunerEV, attemptEV };
  });

  results.sort((a, b) => a.tunerEV - b.tunerEV);

  return results.map((r, i) => ({ ...r, rank: i + 1 }));
}

/* ========================================================================= */
/*                           Formatting Helpers                              */
/* ========================================================================= */

function formatNumber(n: number, decimals = 1): string {
  if (!isFinite(n)) return "∞";
  return n.toFixed(decimals);
}

/** Human-readable label for a single checkpoint */
function checkpointLabel(level: number, required: number): string {
  return `Stop at +${level} if fewer than ${required} hit${required > 1 ? "s" : ""}`;
}

/** Full plain-English description of a policy */
function describePolicyFull(policy: Policy, targetStats: number): string {
  const entries = Object.entries(policy);
  if (entries.length === 0) {
    return `No early stops beyond what's mathematically impossible. For example, with ${targetStats} desired substat${targetStats > 1 ? "s" : ""} you'd still discard at +15 if you have 0 hits with only 2 rolls left.`;
  }
  const checks = entries
    .map(([lvl, req]) => `at +${lvl} if you have fewer than ${req} hit${Number(req) > 1 ? "s" : ""}`)
    .join(", and ");
  return `Discard ${checks}. Beyond these checkpoints, only discard when it becomes mathematically impossible to reach ${targetStats} hit${targetStats > 1 ? "s" : ""}.`;
}

/* ========================================================================= */
/*                              Sub-components                               */
/* ========================================================================= */

function RankBadge({ rank, total }: { rank: number; total: number }) {
  const pct = rank / total;

  const variant =
    rank === 1
      ? "default"
      : pct <= 0.25
        ? "secondary"
        : "outline";

  return (
    <Badge variant={variant} className="tabular-nums w-8 justify-center">
      {rank}
    </Badge>
  );
}

function PolicyTag({ level, required }: { level: number; required: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs cursor-default">
            <span className="text-muted-foreground">+{level}</span>
            <span className="text-foreground font-semibold">≥{required}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {checkpointLabel(level, required)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function EVBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", className)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular-nums text-sm">{formatNumber(value)}</span>
    </div>
  );
}

function ResultsTable({ results, targetStats }: { results: PolicyResult[]; targetStats: number }) {
  const maxTuner = Math.max(...results.map((r) => r.tunerEV));
  const maxAttempt = Math.max(...results.map((r) => r.attemptEV));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Strategy</TableHead>
          <TableHead className="w-40">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="underline decoration-dotted underline-offset-2">
                  Tuner EV
                </TooltipTrigger>
                <TooltipContent>
                  Expected tuners spent per successful echo
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead className="w-40">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="underline decoration-dotted underline-offset-2">
                  Echo EV
                </TooltipTrigger>
                <TooltipContent>
                  Expected attempts needed per successful echo
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map(({ policy, tunerEV, attemptEV, rank }) => {
          const entries = Object.entries(policy);
          const isOptimal = rank === 1;

          return (
            <TableRow
              key={JSON.stringify(policy)}
              className={cn(isOptimal && "bg-muted/40")}
            >
              <TableCell>
                <RankBadge rank={rank} total={results.length} />
              </TableCell>

              <TableCell>
                {entries.length === 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground italic text-sm cursor-default">
                          Discard only when impossible
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-64">
                        {describePolicyFull({}, targetStats)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {entries.map(([lvl, req]) => (
                      <PolicyTag
                        key={lvl}
                        level={Number(lvl)}
                        required={Number(req)}
                      />
                    ))}
                  </div>
                )}
              </TableCell>

              <TableCell>
                <EVBar value={tunerEV} max={maxTuner} className="bg-primary" />
              </TableCell>

              <TableCell>
                <EVBar value={attemptEV} max={maxAttempt} className="bg-chart-2" />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function HowItWorks({ targetStats }: { targetStats: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
        How this works
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-4">
        <p>
          Each echo has 5 upgrade levels (+5 through +25). At each level a substat
          is randomly drawn from a pool of <strong className="text-foreground">13</strong>, shrinking by 1 each roll.
          You want <strong className="text-foreground">{targetStats}</strong> of those rolls to land on your desired substat{targetStats > 1 ? "s" : ""}.
        </p>
        <p>
          The question is: <em>when should you cut your losses and discard early?</em> Discarding
          refunds <strong className="text-foreground">30%</strong> of tuners spent so far.
          Finishing a failed echo to +25 wastes the remaining rolls with no extra refund.
        </p>
        <p>
          A <strong className="text-foreground">policy</strong> is a set of checkpoints — e.g.{" "}
          <em>&quot;stop at +5 unless I have at least 1 hit&quot;</em>. The table below ranks every
          non-redundant policy by expected tuner cost per successful echo, computed
          exactly via a Markov chain with the renewal theorem (not simulation).
        </p>
        <p>
          <strong className="text-foreground">Tuner EV</strong> measures efficiency — lower is cheaper.{" "}
          <strong className="text-foreground">Echo EV</strong> measures how many echoes you&apos;ll burn through — lower means
          fewer attempts. These two goals are often in tension: aggressive early-stop
          policies save tuners but require many more attempts.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}

function OptimalSummary({ result, targetStats }: { result: PolicyResult; targetStats: number }) {
  const { policy, tunerEV, attemptEV } = result;
  const entries = Object.entries(policy);

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Optimal strategy
        </span>
        <Badge>Tuner-efficient</Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {entries.length === 0 ? (
          <span className="text-sm italic text-muted-foreground">
            No extra checkpoints — discard only when impossible
          </span>
        ) : (
          entries.map(([lvl, req]) => (
            <PolicyTag
              key={lvl}
              level={Number(lvl)}
              required={Number(req)}
            />
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {describePolicyFull(policy, targetStats)}
      </p>

      <div className="flex gap-6 pt-1">
        <div>
          <p className="text-xs text-muted-foreground">Tuner EV</p>
          <p className="text-2xl font-semibold tabular-nums">
            {formatNumber(tunerEV)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Echo EV</p>
          <p className="text-2xl font-semibold tabular-nums">
            {formatNumber(attemptEV)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/*                            Main Component                                 */
/* ========================================================================= */

export default function EchoStrategyAnalyzer() {
  const [activeTarget, setActiveTarget] = useState("1");

  const allResults = useMemo(
    () =>
      Object.fromEntries(
        [1, 2, 3, 4, 5].map((t) => [t, computeResults(t)])
      ),
    []
  );

  const target = Number(activeTarget);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Echo Leveling Strategy
        </h2>
        <p className="text-sm text-muted-foreground">
          Optimal early-stop policies ranked by expected tuner cost per successful echo.
          Computed exactly via Markov chain analysis — not simulation.
        </p>
      </div>

      <HowItWorks targetStats={target} />

      <Tabs value={activeTarget} onValueChange={setActiveTarget}>
        <TabsList>
          {[1, 2, 3, 4, 5].map((t) => (
            <TabsTrigger key={t} value={String(t)}>
              {t} substat{t > 1 ? "s" : ""}
            </TabsTrigger>
          ))}
        </TabsList>

        {[1, 2, 3, 4, 5].map((t) => (
          <TabsContent key={t} value={String(t)} className="space-y-4 mt-4">
            <OptimalSummary result={allResults[t][0]} targetStats={t} />
            <ResultsTable results={allResults[t]} targetStats={t} />
          </TabsContent>
        ))}
      </Tabs>

      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        Assumes {SUBSTAT_POOL} substat pool · {TUNER_COST} tuners/roll ·{" "}
        {REFUND_RATE * 100}% discard refund · max level +{MAX_LEVEL}
      </p>
    </div>
  );
}