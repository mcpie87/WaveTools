type Policy = Record<number, number>;
const SUBSTAT_POOL = 13;
const TUNER_COST = 10;
const REFUND_RATE = 0.3;
const MAX_LEVEL = 25;

/* ========================================================================= */
/*                         Markov Chain based Solver                         */
/*                          Utilizes renewal theorem                         */
/* ========================================================================= */
interface SolverResult {
  /** Expected tuners spent per successful echo */
  tunerEV: number;
  /** Expected attempts needed per successful echo */
  attemptEV: number;
}

interface StateValue {
  /** Net expected tuner cost from this state (negative = net refund) */
  eCost: number;
  /** Probability of success from this state */
  pWin: number;
}
class MarkovChainSolver {
  private memo = new Map<string, { eCost: number; pWin: number }>();

  constructor(
    private targetStats: number,
    private policy: Policy,
  ) { }

  public calculate(): SolverResult {
    this.memo.clear();
    const { eCost, pWin } = this.evaluateState(0, 0);
    return {
      tunerEV: pWin > 0 ? eCost / pWin : Infinity,
      attemptEV: pWin > 0 ? 1 / pWin : Infinity,
    };
  }

  /**
   * Recursively evaluates the expected cost and win probability from a given state.
   * Uses memoization to avoid redundant computation.
   *
   * @param level    - Current echo level (0, 5, 10, 15, 20, 25)
   * @param hitCount - Number of desired substats seen so far
   */
  private evaluateState(level: number, hitCount: number): { eCost: number; pWin: number } {
    const key = `${level},${hitCount}`;
    if (this.memo.has(key)) return this.memo.get(key)!;

    if (this.shouldDiscard(level, hitCount)) {
      return this.refundValue(level);
    }

    if (hitCount >= this.targetStats) {
      // We met the target, can level to +25
      return this.autoCompleteValue(level);
    }

    const remainingPool = SUBSTAT_POOL - (level / 5);
    const hitsNeeded = this.targetStats - hitCount;
    const pHit = hitsNeeded / remainingPool;

    const hit = this.evaluateState(level + 5, hitCount + 1);
    const miss = this.evaluateState(level + 5, hitCount);

    const res = {
      eCost: TUNER_COST + pHit * hit.eCost + (1 - pHit) * miss.eCost,
      pWin: pHit * hit.pWin + (1 - pHit) * miss.pWin
    };

    this.memo.set(key, res);
    return res;
  }

  private shouldDiscard(level: number, hitCount: number): boolean {
    const rollsLeft = (MAX_LEVEL - level) / 5;
    const cannotReachTarget = rollsLeft + hitCount < this.targetStats;
    const policyForcesDiscard =
      level in this.policy && hitCount < this.policy[level];

    return cannotReachTarget || policyForcesDiscard;
  }

  /** Net value when discarding: lose what was spent, gain refund */
  private refundValue(level: number): StateValue {
    const spent = (level / 5) * TUNER_COST;
    return { eCost: -(spent * REFUND_RATE), pWin: 0 };
  }

  /** Once target substats are hit, auto-level to +25 */
  private autoCompleteValue(level: number): StateValue {
    const rollsLeft = (MAX_LEVEL - level) / 5;
    return { eCost: rollsLeft * TUNER_COST, pWin: 1 };
  }
}


/* ========================================================================= */
/*                          Monte Carlo Simulator                            */
/* ========================================================================= */

class MonteCarloSolver {
  constructor(
    private readonly targetStats: number,
    private readonly policy: Policy,
    private readonly runs: number = 100_000
  ) { }

  public calculate(): SolverResult {
    let totalTuners = 0;
    let totalAttempts = 0;

    for (let i = 0; i < this.runs; i++) {
      const { tuners, attempts } = this.simulateUntilSuccess();
      totalTuners += tuners;
      totalAttempts += attempts;
    }

    return {
      tunerEV: totalTuners / this.runs,
      attemptEV: totalAttempts / this.runs,
    };
  }

  /**
   * Repeatedly attempts until one succeeds.
   * Returns total tuners spent and attempts taken across all attempts.
   */
  private simulateUntilSuccess(): { tuners: number; attempts: number } {
    const MAX_ATTEMPTS = 100_000; // Infinite loop protection

    let totalTuners = 0;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const { tunersUsed, success } = this.simulateSingleAttempt();
      totalTuners += tunersUsed;
      if (success) return { tuners: totalTuners, attempts: attempt };
    }

    throw new Error(
      `Simulation exceeded ${MAX_ATTEMPTS} attempts — policy may be unreachable.`
    );
  }

  /**
   * Simulates a single echo leveling attempt.
   * Returns early on discard (policy or impossibility), or completes to +25 on success.
   */
  private simulateSingleAttempt(): { tunersUsed: number; success: boolean } {
    let level = 0;
    let spent = 0;
    let hitCount = 0;

    while (level < MAX_LEVEL) {
      if (this.shouldDiscard(level, hitCount)) {
        return { tunersUsed: spent * (1 - REFUND_RATE), success: false };
      }

      if (this.rollSubstat(level, hitCount)) hitCount++;

      level += 5;
      spent += TUNER_COST;

      if (hitCount >= this.targetStats) {
        const remainingRolls = (MAX_LEVEL - level) / 5;
        return { tunersUsed: spent + remainingRolls * TUNER_COST, success: true };
      }
    }

    // Reached +25 without hitting target — discard
    return { tunersUsed: spent * (1 - REFUND_RATE), success: false };
  }

  private shouldDiscard(level: number, hitCount: number): boolean {
    const rollsLeft = (MAX_LEVEL - level) / 5;
    const cannotReachTarget = rollsLeft + hitCount < this.targetStats;
    const policyForcesDiscard =
      this.policy[level] !== undefined && hitCount < this.policy[level];

    return cannotReachTarget || policyForcesDiscard;
  }

  /** Returns true if this roll hits a desired substat */
  private rollSubstat(level: number, hitCount: number): boolean {
    const remainingPool = SUBSTAT_POOL - level / 5;
    const hitsNeeded = this.targetStats - hitCount;
    return Math.random() < hitsNeeded / remainingPool;
  }
}


function generateSensiblePolicies(targetStats: number): Policy[] {
  const LEVELS = [5, 10, 15, 20];
  const results: Policy[] = [];

  function backtrack(index: number, policy: Policy, lastRequired: number): void {
    if (index === LEVELS.length) {
      results.push({ ...policy });
      return;
    }

    const level = LEVELS[index];
    const rollsDone = level / 5;
    const rollsRemaining = (MAX_LEVEL - level) / 5;

    // Option 1: no constraint at this level
    backtrack(index + 1, policy, lastRequired);

    // Option 2: set a meaningful threshold — one that is:
    //   - stricter than the previous checkpoint (> lastRequired)
    //   - stricter than the natural impossibility discard (> targetStats - rollsRemaining)
    const minThreshold = Math.max(lastRequired, targetStats - rollsRemaining) + 1;
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

const SIM_RUNS = 100_000;

for (let target = 1; target <= 5; target++) {
  const policies = generateSensiblePolicies(target);

  const results = policies.map(policy => {
    const markov = new MarkovChainSolver(target, policy);
    const monte = new MonteCarloSolver(target, policy, SIM_RUNS);

    const { tunerEV, attemptEV } = markov.calculate();
    const { tunerEV: simTunerEV } = monte.calculate();
    const err = Math.abs(tunerEV - simTunerEV) / simTunerEV;

    return { policy, tunerEV, attemptEV, simTunerEV, err };
  });

  results.sort((a, b) => a.tunerEV - b.tunerEV);

  console.log(`\nPolicies sorted by Tuner EV for ${target} desired substat(s)`);
  console.table(
    results.map(({ policy, tunerEV, attemptEV, simTunerEV, err }) => ({
      "Strategy": JSON.stringify(policy),
      "EV Tuners": +tunerEV.toFixed(1),
      "EV Echoes": +attemptEV.toFixed(1),
      "Sim Tuner EV": +simTunerEV.toFixed(1),
      "Error": +err.toFixed(3),
    }))
  );
}
