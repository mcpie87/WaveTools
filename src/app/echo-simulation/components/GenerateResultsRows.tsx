import {
  UPGRADE_COST,
  simulate
} from "../services/simulate";
const formatNumber = (num: string | number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// interface GenerateResultsRowsProps {
//   simulateCount: number;
//   desiredSubstats: string[];
//   startSubstats: string[];
// }

export const GenerateResultsRows = async (
  simulateCount: number,
  startSubstats: string[],
  desiredSubstats: string[]
): Promise<React.JSX.Element[]> => {
  const results: { [key: number]: number } = {};
  const trimmedStartSubstats: string[] = startSubstats.filter(e => e);
  const trimmedDesiredSubstats: string[] = desiredSubstats.filter(e => e);
  console.log("Generate RESULTS nm", startSubstats, desiredSubstats);
  console.log("Generate RESULTS trim", trimmedStartSubstats, trimmedDesiredSubstats);
  const startLevel = trimmedStartSubstats.length;
  for (let i = 0; i < simulateCount; ++i) {
    for (let j = startLevel; j <= 5; ++j) {
      if (j < trimmedDesiredSubstats.length) {
        continue;
      }
      const pickedSubstats = [...trimmedStartSubstats];
      const result = simulate(trimmedDesiredSubstats, pickedSubstats, j);
      if (!results[j]) {
        results[j] = 0;
      }
      if (result) {
        results[j]++;
      }
    }
  }
  console.log("RESULTS", results);

  const rows: React.JSX.Element[] = [];
  for (const [k, v] of Object.entries(results)) {
    const chanceToHit = v / simulateCount;
    console.log("GENERATE ROWS CHANCE", k, v, chanceToHit);
    const displayedLevel = "+" + (5 * Number(k));
    const displayedStartLevel = "+" + (5 * startLevel);
    const expectedAttempts = 1 / chanceToHit;
    const expectedTuners = expectedAttempts * (UPGRADE_COST[displayedLevel].tuners - UPGRADE_COST[displayedStartLevel].tuners);
    const expectedExperience = expectedAttempts * (UPGRADE_COST[displayedLevel].exp - UPGRADE_COST[displayedStartLevel].exp);

    const waveplateCost = 60;
    const waveplateTunerReward = 20;
    const waveplateExpReward = 24000;
    const expectedWaveplateForTuner = expectedTuners * (waveplateCost / waveplateTunerReward);
    const expectedWaveplateForExp = expectedExperience * (waveplateCost / waveplateExpReward);

    if (v > 0) {
      rows.push(
        <tr key={k} className="bg-white hover:bg-gray-100">
          <td className="px-4 py-2 border-b">{displayedLevel}</td>
          <td className="px-4 py-2 border-b">{chanceToHit}</td>
          <td className="px-4 py-2 border-b">{formatNumber(expectedAttempts.toFixed(2))}</td>
          <td className="px-4 py-2 border-b">{formatNumber(expectedTuners.toFixed(0))}</td>
          <td className="px-4 py-2 border-b">{formatNumber(expectedWaveplateForTuner.toFixed(0))}</td>
          <td className="px-4 py-2 border-b">{formatNumber(expectedExperience.toFixed(0))}</td>
          <td className="px-4 py-2 border-b">{formatNumber(expectedWaveplateForExp.toFixed(0))}</td>
        </tr>
      );
    }
  }

  return rows;
}