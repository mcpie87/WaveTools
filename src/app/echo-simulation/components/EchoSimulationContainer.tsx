import {
  SubstatEntry
} from "../services/simulate";
import React, { JSX, useState } from "react";
import { GenerateResultsRows } from "./GenerateResultsRows";
import SubstatsSelector from "./SubstatsSelector";

function EchoSimulationComponent() {
  const [simulateCount, setSimulateCount] = useState<number>(1e5);
  const [startSubstats, setStartSubstats] = useState<SubstatEntry[]>([]);
  const [desiredSubstats, setDesiredSubstats] = useState<SubstatEntry[]>([]);
  const [calculateTime, setCalculateTime] = useState<number>(0);
  const [rows, setRows] = useState<JSX.Element[]>([]);

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update the state with the new arrays
    setStartSubstats(startSubstats);
    setDesiredSubstats(desiredSubstats);
    const start = performance.now();
    console.log("Sending calculate", startSubstats, desiredSubstats);
    const rows = await GenerateResultsRows(
      simulateCount,
      startSubstats,
      desiredSubstats
    );
    setRows(rows);
    const end = performance.now();
    console.log("CALCULATE", start, end, end - start);
    setCalculateTime(end - start);
  }
  // console.log(typeof setStartSubstats, typeof setDesiredSubstats);
  return (
    <div className="w-[800] center">
      <form className="flex flex-col" onSubmit={calculate}>
        <div className="flex-col">
          <h3>Start subs</h3>
          <SubstatsSelector
            selectedSubstats={startSubstats}
            selectedSubstatsSetter={setStartSubstats}
          />
        </div>
        <div className="flex-col">
          <h3>Desired subs</h3>
          <SubstatsSelector
            selectedSubstats={desiredSubstats}
            selectedSubstatsSetter={setDesiredSubstats}
            renderValues={true}
          />
        </div>
        <div className="flex flex-row gap-4">
          <h3>Simulate count</h3>
          <input
            id="simulateCount"
            type="number"
            className="border"
            value={simulateCount}
            onChange={(e) => setSimulateCount(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="w-[400] bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          Calculate
        </button>
      </form>

      <div>
        <p>Time spent [ms]: {calculateTime || ""}</p>
        <table className="overflow-x-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border-b" rowSpan={3}>Lvl</th>
              <th className="px-4 py-2 border-b" rowSpan={3}>Chance</th>
              <th className="px-4 py-2 border-b" colSpan={5}>Expected</th>
            </tr>
            <tr>
              <th className="px-4 py-2 border-b" rowSpan={2}>Attempts</th>
              <th className="px-4 py-2 border-b" colSpan={2}>Tuners</th>
              <th className="px-4 py-2 border-b" colSpan={2}>Echo EXP</th>
            </tr>
            <tr>
              <th className="px-4 py-2 border-b">Count</th>
              <th className="px-4 py-2 border-b">Waveplates</th>
              <th className="px-4 py-2 border-b">Count</th>
              <th className="px-4 py-2 border-b">Waveplates</th>
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