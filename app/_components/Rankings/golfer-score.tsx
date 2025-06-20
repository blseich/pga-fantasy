import Image from 'next/image';

import { type UserWithPickDetails } from '@/app/page';

export default function GolferScore({
  golfer,
  score,
  unscored,
}: UserWithPickDetails['picks'][0] & { unscored?: boolean }) {
  return (
    <div
      className={`relative flex w-full items-center gap-2 p-2 ${unscored ? 'opacity-50' : 'border-b-2 border-b-gray-500'}`}
    >
      <Image
        src={golfer.headshot}
        width="65"
        height="47"
        alt="Scottie Scheffler"
      />
      <div className="text-left">
        <div className="text-xs">{golfer.first_name}</div>
        <div className="">{golfer.last_name}</div>
      </div>
      <div className="ml-auto grid grid-cols-[auto_auto] grid-rows-[auto_auto] gap-x-2 text-right">
        {score.today === 'CUT' ? (
          <div className="col-span-2 text-red-400">CUT</div>
        ) : (
          <>
            <div className="text-xs">Today:</div>
            <div className="text-xs">{score.today}</div>
          </>
        )}
        <div className="">Overall:</div>
        <div className="">{score.overall.displayValue}</div>
      </div>
    </div>
  );
}
