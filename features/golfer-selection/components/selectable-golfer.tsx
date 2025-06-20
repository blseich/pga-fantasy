import { type Field } from '@/lib/pga-endpoints/pga-data.types';
import { DataGolferRank } from '../types/data-golf-ranking';
import { ReactNode } from 'react';
import Golfer from './golfer';

type GolferSelection = Field['players'][0] & {
  rank: Pick<DataGolferRank, 'dg_rank' | 'owgr_rank'>;
};

export default function SelectableGolfer({
  golfer,
  children,
}: {
  golfer: GolferSelection;
  children?: ReactNode;
}) {
  return (
    <Golfer
      firstName={golfer.firstName}
      lastName={golfer.lastName}
      dg_rank={golfer.rank.dg_rank}
      owgr_rank={golfer.rank.owgr_rank}
      id={golfer.id}
    >
      {children}
    </Golfer>
  );
}
