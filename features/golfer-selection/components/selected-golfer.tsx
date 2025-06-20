import { type Field } from '@/lib/pga-endpoints/pga-data.types';
import { DataGolferRank } from '../types/data-golf-ranking';
import Golfer from './golfer';

type GolferSelection = Field['players'][0] & {
  rank: Pick<DataGolferRank, 'dg_rank' | 'owgr_rank'>;
};

export default function SelectedGolfer({
  golfer,
}: {
  golfer: GolferSelection;
}) {
  return (
    <Golfer
      firstName={golfer.firstName}
      lastName={golfer.lastName}
      dg_rank={golfer.rank.dg_rank}
      owgr_rank={golfer.rank.owgr_rank}
      id={golfer.id}
    >
      <div className="ml-auto grid aspect-square h-[40px] place-content-center font-bold text-green-500">
        PICKED
      </div>
    </Golfer>
  );
}
