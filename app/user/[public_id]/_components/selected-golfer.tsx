import { ArrowRightLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type SelectedGolferProps = {
  rank_bucket: string;
  rank: {
    dg_rank: string;
    owgr_rank: string;
  };
  swapLink: string;
  scoringData?: {
    score: string;
    thru: string;
    total: string;
  };
  golfer: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export default function SelectedGolfer({
  golfer,
  rank_bucket,
  rank,
  swapLink,
  scoringData,
}: SelectedGolferProps) {
  return (
    <div className="mb-4 flex w-full items-center gap-2 border-b-2 pb-2">
      <div className="relative flex size-[108px] flex-col justify-end overflow-hidden">
        <Image
          className="absolute -left-1/4 -z-10 max-w-[150%]"
          src={`https://pga-tour-res.cloudinary.com/image/upload/headshots_${golfer.id}.png`}
          width="192"
          height="128"
          alt={`${golfer.firstName} ${golfer.lastName}`}
        />
        <div className="bottom-0 w-full bg-brand-blue text-center text-sm text-black">
          {rank_bucket}
        </div>
      </div>
      <div className="flex grow flex-col gap-x-2 gap-y-4">
        <div className="overflow-hidden">
          <div className="text-sm">{golfer.firstName}</div>
          <div className="truncate text-2xl">{golfer.lastName}</div>
        </div>
        <div className="grid h-[40px] grid-cols-[55px_auto] grid-rows-[auto_auto] items-end gap-x-2 text-xs">
          <div>DG Rank:</div>
          <div>{rank.dg_rank}</div>
          <div>WG Rank:</div>
          <div>{rank.owgr_rank}</div>
        </div>
      </div>
      <div className="mr-2 h-full w-[80px] text-center">
        {scoringData && scoringData.score ? (
          <>
            {scoringData.score === '-' ? (
              <div className="text-sm text-red-400">CUT</div>
            ) : (
              <div className="text-sm">
                {scoringData.score} ({scoringData.thru})
              </div>
            )}
            <div className="p-2 text-lg text-brand-green">
              {scoringData.total}
            </div>
          </>
        ) : (
          <>
            <Link
              href={swapLink}
              className="mx-auto flex w-fit rounded-lg bg-yellow-300 px-4 py-2 text-black"
            >
              <ArrowRightLeft className="inline" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
