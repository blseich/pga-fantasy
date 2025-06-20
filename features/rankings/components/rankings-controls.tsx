import { CopyMinus, CopyPlus, Crosshair } from 'lucide-react';
import { RefObject, useCallback } from 'react';

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
  const expandAll = useCallback(() => {
    const allIndexes = Array.from({ length: totalRanks }, (_, index) => index);
    callback(allIndexes);
  }, [totalRanks, callback]);

  const collapseAll = useCallback(() => {
    callback([]);
  }, [callback]);

  const findMe = useCallback(() => {
    myRankRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
    myRankRef.current?.classList.add('highlighted');
    setTimeout(() => myRankRef.current?.classList.remove('highlighted'), 2000);
  }, [myRankRef]);

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
