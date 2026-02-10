import {
  SubstatEntry
} from "../services/simulate";
import React, { JSX, useState } from "react";
import { GenerateResultsRows } from "./GenerateResultsRows";
import SubstatsSelector from "./SubstatsSelector";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

function EchoSimulationComponent() {
  const [startSubstats, setStartSubstats] = useState<SubstatEntry[]>([]);
  const [desiredSubstats, setDesiredSubstats] = useState<SubstatEntry[]>([]);
  const [calculateTime, setCalculateTime] = useState<number>(0);
  const [rows, setRows] = useState<JSX.Element[]>([]);
  const [assumeRefund, setAssumeRefund] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [checkForAny, setCheckForAny] = useState<boolean>(false);
  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    // doesn't render, no clue why
    // it's not the await
    setShowResults(false);
    setStartSubstats(startSubstats);
    setDesiredSubstats(desiredSubstats);
    const start = performance.now();
    const rows = GenerateResultsRows(
      startSubstats,
      desiredSubstats,
      checkForAny,
      assumeRefund,
    );
    setRows(rows);
    const end = performance.now();
    setCalculateTime(end - start);
    setShowResults(true);
  }

  return (
    <div className="flex flex-col items-center">
      <form className="flex flex-col gap-2" onSubmit={calculate}>
        <div className="flex-col">
          <h3>Start subs</h3>
          <SubstatsSelector
            selectedSubstats={startSubstats}
            selectedSubstatsSetter={setStartSubstats}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-4 items-center p-2">
            <h3>Desired subs</h3>
            <Toggle
              pressed={checkForAny}
              onPressedChange={() => setCheckForAny(!checkForAny)}
            >
              Look for any?
            </Toggle>
            <Toggle
              pressed={assumeRefund}
              onPressedChange={() => setAssumeRefund(!assumeRefund)}
            >
              Assume refund?
            </Toggle>
          </div>
          <SubstatsSelector
            selectedSubstats={desiredSubstats}
            selectedSubstatsSetter={setDesiredSubstats}
            renderValues={true}
          />
        </div>
        <Button type="submit">Calculate</Button>
      </form>
      {showResults &&
        <div className="bg-base-300 p-5 m-5 rounded-md">
          <p>Time spent [ms]: {calculateTime || ""}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center" rowSpan={3}>Lvl</TableHead>
                <TableHead className="text-center" rowSpan={3}>Chance</TableHead>
                <TableHead className="text-center" colSpan={5}>Expected</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center" rowSpan={2}>Attempts</TableHead>
                <TableHead className="text-center" colSpan={2}>Tuners</TableHead>
                <TableHead className="text-center" colSpan={2}>Echo EXP</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center">Count</TableHead>
                <TableHead className="text-center">Waveplates</TableHead>
                <TableHead className="text-center">Count</TableHead>
                <TableHead className="text-center">Waveplates</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows}
            </TableBody>
          </Table>
        </div>
      }
    </div>
  )
}
export default EchoSimulationComponent;