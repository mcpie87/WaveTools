'use client';

import React, { JSX, useState } from "react";
import { UNION_LEVEL_DATA } from "./union-level-data";
import { formatNumber } from "@/utils/utils";
export default function UnionLevelPage() {
  const [currentExp, setCurrentExp] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [desiredLevel, setDesiredLevel] = useState<number>(80);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [displayedRows, setDisplayedRows] = useState<JSX.Element[]>([]);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const rows = [];
    for (let i = currentLevel + 1; i <= desiredLevel; i++) {
      const expDiff = UNION_LEVEL_DATA[i][1] - UNION_LEVEL_DATA[currentLevel][1] - currentExp;
      const daysNeeded = expDiff / (7.5 * (240 + refreshCount * 60));

      rows.push(
        <tr key={i}>
          <td>{i}</td>
          <td>{formatNumber(expDiff)}</td>
          <td>{formatNumber(daysNeeded.toFixed(2))}</td>
        </tr>
      )
    }
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
          <button onClick={calculate}>Calculate</button>
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