import { WAVEPLATE_ICON_URL } from "@/constants/constants";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TooltipComponent } from "./TooltipComponent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Runs</TableHead>
          <TableHead>Waveplate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedBreakdown.map(waveplateEntry => (
          <TableRow key={waveplateEntry.label}>
            <TableCell>{waveplateEntry.label}</TableCell>
            <TableCell>{waveplateEntry.runCount.toFixed(3)}</TableCell>
            <TableCell>{waveplateEntry.waveplateCount.toFixed(3)}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell>TOTAL</TableCell>
          <TableCell>{breakdown.map(e => e.runCount).reduce((acc, e) => e + acc).toFixed(2)}</TableCell>
          <TableCell>{breakdown.map(e => e.waveplateCount).reduce((acc, e) => e + acc).toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}