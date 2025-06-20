import { PickEntry } from '../types/pick-map';
import getRosteredGolfer from '../utils/get-rostered-golfer';
import Image from 'next/image';
import Score from './score';
import PickerLink from './picker-link';

export default async function SelectedGolfer({ pick }: { pick: PickEntry }) {
  const golfer = await getRosteredGolfer(pick);
  if (!golfer || !golfer.player) return null;
  const { player, scoringData } = golfer;
  return (
    <div className="mb-4 flex w-full items-center gap-2 border-b-2 pb-2">
      <div className="relative flex size-[108px] flex-col justify-end overflow-hidden">
        <Image
          className="absolute -left-1/4 -z-10 max-w-[150%]"
          src={`https://pga-tour-res.cloudinary.com/image/upload/headshots_${player.id}.png`}
          width="192"
          height="128"
          alt={`${player.firstName} ${player.lastName}`}
        />
        <div className="bottom-0 w-full bg-brand-blue text-center text-sm text-black">
          {pick.rank_bucket}
        </div>
      </div>
      <div className="flex grow flex-col gap-x-2 gap-y-4">
        <div className="overflow-hidden">
          <div className="text-sm">{player.firstName}</div>
          <div className="truncate text-2xl">{player.lastName}</div>
        </div>
        <div className="grid h-[40px] grid-cols-[55px_auto] grid-rows-[auto_auto] items-end gap-x-2 text-xs">
          <div>DG Rank:</div>
          <div>{pick.dg_rank}</div>
          <div>WG Rank:</div>
          <div>{pick.owgr_rank}</div>
        </div>
      </div>
      <div className="mr-2 h-full w-[80px] text-center">
        {scoringData ? (
          <Score scoringData={scoringData} />
        ) : (
          <PickerLink bucket={pick.rank_bucket} swap />
        )}
      </div>
    </div>
  );
}
