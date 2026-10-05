import { TableCell, TableRow } from "@/components/ui/table";
import {
  SubstatEntry,
  UPGRADE_COST,
  calculateProbabilityOfDesiredSubstats
} from "../services/simulate";
import { formatNumber, formatPercent } from "@/utils/utils";

export const GenerateResultsRows = (
  startSubstats: SubstatEntry[],
  desiredSubstats: SubstatEntry[],
  checkForAny: boolean,
  assumeRefund: boolean,
): React.JSX.Element[] => {
  const results: { [key: number]: number } = {};
  const trimmedStartSubstats: SubstatEntry[] = startSubstats.filter(e => e.name);
  const trimmedDesiredSubstats: SubstatEntry[] = desiredSubstats.filter(e => e.name);
  const startLevel = trimmedStartSubstats.length;

  for (let i = startLevel; i <= 5; ++i) {
    results[i] = calculateProbabilityOfDesiredSubstats(
      trimmedDesiredSubstats,
      trimmedStartSubstats,
      i,
      checkForAny
    );
  }

  const rows: React.JSX.Element[] = [];
  for (const [k, v] of Object.entries(results)) {
    const chanceToHit = v;
    const displayedLevel = "+" + (5 * Number(k));
    const displayedStartLevel = "+" + (5 * startLevel);
    const expectedAttempts = 1 / chanceToHit;
    const expectedTuners = (assumeRefund ? 0.7 : 1) * expectedAttempts * (UPGRADE_COST[displayedLevel].tuners - UPGRADE_COST[displayedStartLevel].tuners);
    const expectedExperience = (assumeRefund ? 0.25 : 1) * expectedAttempts * (UPGRADE_COST[displayedLevel].exp - UPGRADE_COST[displayedStartLevel].exp);

    const waveplateCost = 60;
    const waveplateTunerReward = 20;
    const waveplateExpReward = 24000;
    const expectedWaveplateForTuner = expectedTuners * (waveplateCost / waveplateTunerReward);
    const expectedWaveplateForExp = expectedExperience * (waveplateCost / waveplateExpReward);

    if (v > 0) {
      rows.push(
        <TableRow key={k}>
          <TableCell className="text-center">{displayedLevel}</TableCell>
          <TableCell className="text-center">{formatPercent(chanceToHit, 8)}</TableCell>
          <TableCell className="text-center">{formatNumber(expectedAttempts.toFixed(2))}</TableCell>
          <TableCell className="text-center">{formatNumber(expectedTuners.toFixed(0))}</TableCell>
          <TableCell className="text-center">{formatNumber(expectedWaveplateForTuner.toFixed(0))}</TableCell>
          <TableCell className="text-center">{formatNumber(expectedExperience.toFixed(0))}</TableCell>
          <TableCell className="text-center">{formatNumber(expectedWaveplateForExp.toFixed(0))}</TableCell>
        </TableRow>
      );
    }
  }

  return rows;
}