import { WAVEPLATE_ICON_URL } from "@/constants/constants";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TooltipComponent } from "./TooltipComponent";

export interface WaveplateEntry {
  label: string;
  runCount: number;
  waveplateCount: number;
}

interface WaveplateComponentProps {
  breakdown: WaveplateEntry[];
  vertical?: boolean;
}
export const WaveplateComponent = ({ breakdown, vertical }: WaveplateComponentProps) => {
  const [waveplate, setWaveplate] = useState(0);

  useEffect(() => {
    const totalWaveplate = breakdown
      .reduce((acc, elem) => acc + elem.waveplateCount, 0);
    setWaveplate(totalWaveplate);

  }, [breakdown]);

  if (waveplate === 0) { return }

  return (
    <div className="border border-black rounded-md">
      <TooltipComponent
        content={(<WaveplateSummaryComponent breakdown={breakdown} />)}
      >
        <div className={`flex items-center ${vertical ? "flex-col" : "flex-row"}`}>
          <div className="flex items-center px-2 py-1">
            <Image
              src={convertToUrl(WAVEPLATE_ICON_URL)}
              alt={"Waveplate icon"}
              width={32}
              height={32}
            />
            {waveplate.toFixed(0)}
          </div>
          <div className="flex items-center px-2 py-1">
            Days: {(waveplate / 240).toFixed(2)}
          </div>
        </div>
      </TooltipComponent>
    </div>
  )
}

const WaveplateSummaryComponent = ({ breakdown }: WaveplateComponentProps) => {
  const displayedBreakdown = breakdown.filter(e => e.waveplateCount > 0);

  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Runs</th>
          <th>Waveplate</th>
        </tr>
      </thead>
      <tbody>
        {displayedBreakdown.map(waveplateEntry => (
          <tr key={waveplateEntry.label}>
            <td>{waveplateEntry.label}</td>
            <td>{waveplateEntry.runCount.toFixed(3)}</td>
            <td>{waveplateEntry.waveplateCount.toFixed(3)}</td>
          </tr>
        ))}
        <tr>
          <td>TOTAL</td>
          <td>{breakdown.map(e => e.runCount).reduce((acc, e) => e + acc).toFixed(2)}</td>
          <td>{breakdown.map(e => e.waveplateCount).reduce((acc, e) => e + acc).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  )
}