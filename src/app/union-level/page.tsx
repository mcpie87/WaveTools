'use client';

import React, { JSX, useState } from "react";
import { UNION_LEVEL_DATA } from "./union-level-data";
import { formatNumber } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import LocalStorageService from "@/services/LocalStorageService";
import { UnionLevelPageData } from "@/types/unionLevelDataTypes";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
        <TableRow key={i}>
          <TableCell className="text-center">{i}</TableCell>
          <TableCell className="text-right">{formatNumber(expDiff)}</TableCell>
          <TableCell className="text-right">{formatNumber(daysNeeded.toFixed(2))}</TableCell>
          <TableCell className="text-right">{formatNumber(waveplateNeeded.toFixed(2))}</TableCell>
          <TableCell className="text-center">{formatNumber(crystalSolventNeeded.toFixed(2))}</TableCell>
        </TableRow>
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
          {[
            ["Current Exp", "currentExp", unionLevelData.currentExp, updateCurrentExp],
            ["Current Level", "currentLevel", unionLevelData.currentLevel, updateCurrentLevel],
            ["Desired Level", "desiredLevel", unionLevelData.desiredLevel, updateDesiredLevel],
            ["Refresh Count", "refreshCount", unionLevelData.refreshCount, updateRefreshCount],
            ["Table Steps", "tableSteps", unionLevelData.tableSteps, updateTableSteps],
          ].map(([label, field, value, onChange]) => (
            <div key={field as string} className="flex flex-row gap-2">
              <label htmlFor={field as string}>{label as string}</label>
              <input
                type="number"
                id={field as string}
                value={value as number}
                onChange={(e) => (onChange as (value: number) => void)(parseInt(e.target.value))}
              />
            </div>
          ))}
          <Button onClick={calculate}>Calculate</Button>
        </form>
      </div>
      <div className="flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Lvl</TableHead>
              <TableHead className="text-center">Exp Diff</TableHead>
              <TableHead className="text-center">Days</TableHead>
              <TableHead className="text-center">Waveplate</TableHead>
              <TableHead className="text-center">Crystal Solvent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRows}
          </TableBody>
        </Table>
      </div>
    </div >
  );
}