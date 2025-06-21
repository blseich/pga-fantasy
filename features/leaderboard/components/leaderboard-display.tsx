'use client';

import { Leaderboard } from '@/lib/pga-endpoints/pga-data.types';
import Filter from '@/features/leaderboard/components/filter';
import { LeaderboardPick } from '../types/leaderboard-pick';
import LeaderboardRow from './leaderboard-row';
import getPickersForRow from '../utils/get-pickers-for-row';
import useFilteredLeaderboard from '../hooks/use-filtered-leaderboard';

const CutLine = () => (
  <div className="flex items-center gap-2 py-2">
    <div className="h-[2px] grow bg-red-300" />
    <div className="text-red-400">CUT LINE</div>
    <div className="h-[2px] grow bg-red-300" />
  </div>
);

export default function LeaderboardDisplay({
  leaderboard,
  picks,
  user_id = '',
}: {
  leaderboard: Leaderboard['players'];
  picks: LeaderboardPick[];
  user_id?: string;
}) {
  const { filteredLeaderboard, filterAll, filterPicked, filterMine } =
    useFilteredLeaderboard(leaderboard, picks, user_id);

  return (
    <>
      <div className="my-8 flex justify-center gap-8 text-gray-500">
        <Filter type="All" callback={filterAll} defaultChecked />
        <Filter type="Picked" callback={filterPicked} />
        <Filter type="Mine" callback={filterMine} />
      </div>
      <div className="px-4">
        {filteredLeaderboard.map((row) =>
          row.player === undefined && row.scoringData === undefined ? (
            <CutLine key={'cutline'} />
          ) : (
            <LeaderboardRow
              key={row.player.id}
              row={row}
              pickers={getPickersForRow(picks, row)}
            />
          ),
        )}
      </div>
    </>
  );
}
