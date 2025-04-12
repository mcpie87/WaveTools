'use client';

import React, { JSX, useState } from "react";
import { UNION_LEVEL_DATA } from "./union-level-data";
import { formatNumber } from "@/utils/utils";
import { Button } from "@/components/ui/button";
export default function UnionLevelPage() {
  const [currentExp, setCurrentExp] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [desiredLevel, setDesiredLevel] = useState<number>(80);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [tableSteps, setTableSteps] = useState<number>(1);
  const [displayedRows, setDisplayedRows] = useState<JSX.Element[]>([]);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const rows = [];

    const genRow = (i: number) => {
      const expDiff = UNION_LEVEL_DATA[i][1] - UNION_LEVEL_DATA[currentLevel][1] - currentExp;
      const waveplateUnion = 7.5 * (240 + refreshCount * 60);
      const guidebookUnion = 2000;
      const daysNeeded = expDiff / (waveplateUnion + guidebookUnion);
      const waveplateNeeded = (expDiff * 240) / waveplateUnion;
      const crystalSolventNeeded = waveplateNeeded / 60;

      return (
        <tr key={i}>
          <td>{i}</td>
          <td>{formatNumber(expDiff)}</td>
          <td>{formatNumber(daysNeeded.toFixed(2))}</td>
          <td>{formatNumber(waveplateNeeded.toFixed(2))}</td>
          <td>{formatNumber(crystalSolventNeeded.toFixed(2))}</td>
        </tr>
      )
    }
    const inc = Math.min(80, Math.max(tableSteps, 1));

    for (let i = currentLevel + inc; i < desiredLevel; i += inc) {
      rows.push(genRow(i));
    }
    rows.push(genRow(desiredLevel));
    setDisplayedRows(rows);
  };

  return (
    <div className="bg-base-200 rounded-md flex flex-col gap-2 w-fit m-auto">
      <h1>Union Level Page</h1>
      <div className="bg-base-200 flex flex-col gap-2">
        <form className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <label htmlFor="currentExp">Current Exp</label>
            <input
              type="number"
              id="currentExp"
              value={currentExp}
              onChange={(e) => setCurrentExp(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="currentLevel">Current Level</label>
            <input
              type="number"
              id="currentLevel"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="desiredLevel">Desired Level</label>
            <input
              type="number"
              id="desiredLevel"
              value={desiredLevel}
              onChange={(e) => setDesiredLevel(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="refreshCount">Refresh Count</label>
            <input
              type="number"
              id="refreshCount"
              value={refreshCount}
              onChange={(e) => setRefreshCount(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="tableSteps">Table Steps</label>
            <input
              type="number"
              id="tableSteps"
              value={tableSteps}
              onChange={(e) => setTableSteps(parseInt(e.target.value))}
            />
          </div>
          <Button onClick={calculate}>Calculate</Button>
        </form>
      </div>
      <div className="flex flex-col gap-2">
        <div>Current Exp: {currentExp}</div>
        <table className="overflow-x-auto bg-white shadow-md rounded-lg text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border-b">Lvl</th>
              <th className="px-4 py-2 border-b">Exp Diff</th>
              <th className="px-4 py-2 border-b">Days</th>
              <th className="px-4 py-2 border-b">Waveplate</th>
              <th className="px-4 py-2 border-b">Crystal Solvent</th>
            </tr>
          </thead>

          <tbody>
            {displayedRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}