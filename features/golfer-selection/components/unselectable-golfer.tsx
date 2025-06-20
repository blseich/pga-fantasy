import { DataGolferRank } from '../types/data-golf-ranking';
import Golfer from './golfer';

export default function UnselectableGolfer({
  golfer,
}: {
  golfer: DataGolferRank;
}) {
  const [lastName, firstName] = golfer.player_name.split(', ');
  return (
    <Golfer
      firstName={firstName}
      lastName={lastName}
      dg_rank={golfer.dg_rank}
      owgr_rank={golfer.owgr_rank}
    >
      <div className="ml-auto grid aspect-square h-[40px] place-content-center font-bold text-red-500">
        OUT
      </div>
    </Golfer>
  );
}
