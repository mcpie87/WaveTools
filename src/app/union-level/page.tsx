'use client';

import React, { JSX, useState } from "react";
import { UNION_LEVEL_DATA } from "./union-level-data";
import { formatNumber } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import LocalStorageService from "@/services/LocalStorageService";
import { UnionLevelPageData } from "@/types/unionLevelDataTypes";
import { useEffect } from "react";

const storageService = new LocalStorageService("union_levels");

export default function UnionLevelPage() {
  const [unionLevelData, setUnionLevelData] = useState<UnionLevelPageData | null>(null);
  const [displayedRows, setDisplayedRows] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const data = storageService.load() as UnionLevelPageData || {
      currentExp: 0,
      currentLevel: 1,
      desiredLevel: 80,
      refreshCount: 0,
      tableSteps: 1,
    };
    setUnionLevelData(data);
  }, []);

  useEffect(() => {
    if (!unionLevelData) return;
    storageService.save(unionLevelData);
  }, [unionLevelData]);

  if (!unionLevelData) return (<div>Loading...</div>);

  const updateField = (field: keyof UnionLevelPageData, value: number) => {
    setUnionLevelData(prev => (prev ? { ...prev, [field]: value } : prev));
  }
  const updateCurrentExp = (value: number) => {
    updateField("currentExp", Math.min(Math.max(value, 0), 1e9));
  }
  const updateCurrentLevel = (value: number) => {
    updateField("currentLevel", Math.min(Math.max(value, 1), 79));
  }
  const updateDesiredLevel = (value: number) => {
    updateField("desiredLevel", Math.min(Math.max(value, 2), 80));
  }
  const updateRefreshCount = (value: number) => {
    updateField("refreshCount", Math.min(Math.max(value, 0), 6));
  }
  const updateTableSteps = (value: number) => {
    updateField("tableSteps", Math.min(Math.max(value, 1), 80));
  }

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const rows = [];
    const {
      currentExp,
      currentLevel,
      desiredLevel,
      refreshCount,
      tableSteps,
    } = unionLevelData;

    const genRow = (i: number): JSX.Element => {
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
              value={unionLevelData.currentExp}
              onChange={(e) => updateCurrentExp(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="currentLevel">Current Level</label>
            <input
              type="number"
              id="currentLevel"
              value={unionLevelData.currentLevel}
              onChange={(e) => updateCurrentLevel(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="desiredLevel">Desired Level</label>
            <input
              type="number"
              id="desiredLevel"
              value={unionLevelData.desiredLevel}
              onChange={(e) => updateDesiredLevel(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="refreshCount">Refresh Count</label>
            <input
              type="number"
              id="refreshCount"
              value={unionLevelData.refreshCount}
              onChange={(e) => updateRefreshCount(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="tableSteps">Table Steps</label>
            <input
              type="number"
              id="tableSteps"
              value={unionLevelData.tableSteps}
              onChange={(e) => updateTableSteps(parseInt(e.target.value))}
            />
          </div>
          <Button onClick={calculate}>Calculate</Button>
        </form>
      </div>
      <div className="flex flex-col gap-2">
        <div>Current Exp: {unionLevelData.currentExp}</div>
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