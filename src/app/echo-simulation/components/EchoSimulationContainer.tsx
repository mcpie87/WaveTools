import {
  UPGRADE_COST,
  SUBSTATS,
  simulate
} from "../services/simulate";
import React, { useState } from "react";

const formatNumber = (num: string | number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface GenerateResultsRowsProps {
  simulateCount: number;
  desiredSubstats: string[];
  startSubstats: string[];
}

const GenerateResultsRows: React.FC<GenerateResultsRowsProps> = ({ simulateCount, desiredSubstats, startSubstats }) => {
  const results: { [key: number]: number } = {};
  const ATTEMPTS = simulateCount;

  const trimmedStartSubstats: string[] = startSubstats.filter(e => e);
  const trimmedDesiredSubstats: string[] = desiredSubstats.filter(e => e);

  const startLevel = trimmedStartSubstats.length;
  for (let i = 0; i < ATTEMPTS; ++i) {
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

  const mainOut: any[] = [];
  for (const [k, v] of Object.entries(results)) {
    const chanceToHit = v / ATTEMPTS;
    const displayedLevel = "+" + (5 * k);
    const displayedStartLevel = "+" + (5 * startLevel);
    const expectedAttempts = 1 / chanceToHit;
    const expectedTuners = expectedAttempts * (UPGRADE_COST[displayedLevel].tuners - UPGRADE_COST[displayedStartLevel].tuners);
    const expectedExperience = expectedAttempts * (UPGRADE_COST[displayedLevel].exp - UPGRADE_COST[displayedStartLevel].exp);

    const waveplateCost = 60;
    const waveplateTunerReward = 20;
    const waveplateExpReward = 24000;
    const expectedWaveplateForTuner = expectedTuners * (waveplateCost / waveplateTunerReward);
    const expectedWaveplateForExp = expectedExperience * (waveplateCost / waveplateExpReward);

    const out = [];
    if (v > 0) {
      out.push(<td className="px-4 py-2 border-b">{displayedLevel}</td>);
      out.push(<td className="px-4 py-2 border-b">{chanceToHit}</td>);
      out.push(<td className="px-4 py-2 border-b">{formatNumber(expectedAttempts.toFixed(2))}</td>);
      out.push(<td className="px-4 py-2 border-b">{formatNumber(expectedTuners.toFixed(0))}</td>);
      out.push(<td className="px-4 py-2 border-b">{formatNumber(expectedWaveplateForTuner.toFixed(0))}</td>);
      out.push(<td className="px-4 py-2 border-b">{formatNumber(expectedExperience.toFixed(0))}</td>);
      out.push(<td className="px-4 py-2 border-b">{formatNumber(expectedWaveplateForExp.toFixed(0))}</td>);
    }
    mainOut.push(out);
  }

  return mainOut.map((line, index) => {
    console.log("wololo", line, index);
    return (
      <tr key={index} className="bg-white hover:bg-gray-100">
        {line}
      </tr>
    )
  })
}

function EchoSimulationComponent() {
  const [simulateCount, setSimulateCount] = useState<number>(1e4);
  const [startSubstats, setStartSubstats] = useState<string[]>(new Array(5).fill(""));
  const [desiredSubstats, setDesiredSubstats] = useState<string[]>(new Array(5).fill(""));
  const [rows, setRows] = useState<JSX.Element[]>([]);

  const handleSubstatChange = (type: "desired" | "start", key: number, value: string) => {
    const isDesired = type === "desired";
    const setter = isDesired ? setDesiredSubstats : setStartSubstats;
    const currentSubstats = isDesired ? desiredSubstats : startSubstats;

    const updatedSubstats = [...currentSubstats];
    updatedSubstats[key] = value;
    setter(updatedSubstats);

    console.log("Handle Sub", type, key, value, updatedSubstats);
  }

  const generateAvailableSubstats = (pickedSubstats: string[], value: string): string[] => {
    console.log("GENERATE!", pickedSubstats);

    const res = [
      ...SUBSTATS.filter(substat => !pickedSubstats.includes(substat)),
      value
    ].sort();
    console.log(res);
    return res;
  }

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();

    const startSubs = startSubstats;
    const desiredSubs = desiredSubstats;

    // Update the state with the new arrays
    setStartSubstats(startSubs);
    setDesiredSubstats(desiredSubs);
    setRows((
      <GenerateResultsRows
        simulateCount={simulateCount}
        startSubstats={startSubstats}
        desiredSubstats={desiredSubstats}
      />
    ));
  }

  console.log("RENDER!");
  return (
    <div className="">
      <form className="flex flex-col" onSubmit={calculate}>
        <div className="flex-col border border-black border-solid">
          <h3>Start subs</h3>
          {startSubstats.map((value, index) => (
            <select
              key={index}
              value={value}
              onChange={(e => handleSubstatChange("start", index, e.target.value))}
            >
              <option value=""></option>
              {generateAvailableSubstats(startSubstats, value).map((substat, index) => (
                <option key={index} value={substat}>{substat}</option>
              ))}
            </select>
          ))}
        </div>
        <div className="flex-col border border-black border-solid">
          <h3>Desired subs</h3>
          {desiredSubstats.map((value, index) => (
            <select
              key={index}
              value={value}
              onChange={(e => handleSubstatChange("desired", index, e.target.value))}
            >
              <option value=""></option>
              {generateAvailableSubstats(desiredSubstats, value).map((substat, index) => (
                <option key={index} value={substat}>{substat}</option>
              ))}
            </select>
          ))}
        </div>
        <div>
          <h3>Simulate count</h3>
          <input id="simulateCount" type="number" value={simulateCount} onChange={(e) => setSimulateCount(Number(e.target.value))} />
        </div>
        <button type="submit" className="bg-blue-200">Calculate</button>
      </form>

      <div>
        <div>Desired substats: {desiredSubstats.length} {desiredSubstats}</div>
        <div>Start substats: {startSubstats.length} {startSubstats}</div>
        <div>Attempt count: {formatNumber(simulateCount)}</div>
        <table className="overflow-x-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border-b">Lvl</th>
              <th className="px-4 py-2 border-b">Chance</th>
              <th className="px-4 py-2 border-b">Expected Attempts</th>
              <th className="px-4 py-2 border-b">Expected Tuners Count</th>
              <th className="px-4 py-2 border-b">Expected Tuner Waveplates</th>
              <th className="px-4 py-2 border-b">Expected Echo EXP Count</th>
              <th className="px-4 py-2 border-b">Expected Echo EXP Waveplates</th>
            </tr>
          </thead>

          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default EchoSimulationComponent;