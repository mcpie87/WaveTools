import {
  SUBSTATS
} from "../services/simulate";
import React, { JSX, useState } from "react";
import { GenerateResultsRows } from "./GenerateResultsRows";

function EchoSimulationComponent() {
  const [simulateCount, setSimulateCount] = useState<number>(1e4);
  const [startSubstats, setStartSubstats] = useState<string[]>(new Array(5).fill(""));
  const [desiredSubstats, setDesiredSubstats] = useState<string[]>(new Array(5).fill(""));
  const [calculateTime, setCalculateTime] = useState<number>(0);
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
    return [
      ...SUBSTATS.filter(substat => !pickedSubstats.includes(substat)),
      ...(value !== "" ? [value] : [])
    ].sort();
  }

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();

    const startSubs = startSubstats;
    const desiredSubs = desiredSubstats;

    // Update the state with the new arrays
    setStartSubstats(startSubs);
    setDesiredSubstats(desiredSubs);
    const start = performance.now();
    console.log("Wololo start");
    const rows = await GenerateResultsRows(
      simulateCount,
      startSubstats,
      desiredSubstats
    );
    console.log("wololo end", rows);
    setRows(rows);
    const end = performance.now();
    console.log("CALCULATE", start, end, end - start);
    setCalculateTime(end - start);
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
        <button type="submit" className="bg-blue-200 w-60">Calculate</button>
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