import { CopyMinus, CopyPlus, Crosshair } from 'lucide-react';
import { RefObject } from 'react';
import {
  useCollapseAll,
  useExpandAll,
  useFindMe,
} from '../hooks/use-rank-controls';

type RankingControlsProps = {
  totalRanks: number;
  myRankRef: RefObject<HTMLButtonElement | null>;
  callback: (x: number[]) => void;
};

export default function RankingControls({
  totalRanks,
  myRankRef,
  callback,
}: RankingControlsProps) {
  const expandAll = useExpandAll(totalRanks, callback);
  const collapseAll = useCollapseAll(callback);
  const findMe = useFindMe(myRankRef);

  return (
    <div className="sticky bottom-0 z-10 w-full border-b-2 border-gray-500 bg-black">
      <div className="flex items-center justify-center gap-16 py-4">
        <button className="flex flex-col items-center" onClick={expandAll}>
          <CopyPlus />
        </button>
        <button className="flex flex-col items-center" onClick={collapseAll}>
          <CopyMinus />
        </button>
        <button className="flex flex-col items-center" onClick={findMe}>
          <Crosshair />
        </button>
      </div>
    </div>
  );
}
