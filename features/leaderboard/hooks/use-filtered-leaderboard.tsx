import { Leaderboard } from '@/lib/pga-endpoints/pga-data.types';
import { useCallback, useState } from 'react';
import { LeaderboardPick } from '../types/leaderboard-pick';

export default function useFilteredLeaderboard(
  leaderboard: Leaderboard['players'],
  picks: LeaderboardPick[],
  user_id: string,
) {
  const [activeFilter, setActiveFilter] = useState('all');

  let filteredLeaderboard = leaderboard;
  if (activeFilter === 'picked')
    filteredLeaderboard = leaderboard.filter(
      (row) =>
        row.player === undefined ||
        picks.some((pick) => pick.golfer_id === row.player?.id),
    );
  if (activeFilter === 'mine')
    filteredLeaderboard = leaderboard.filter(
      (row) =>
        row.player === undefined ||
        picks.some(
          (pick) =>
            pick.golfer_id === row.player?.id && pick.user_id === user_id,
        ),
    );

  const filterAll = useCallback(
    () => setActiveFilter('all'),
    [setActiveFilter],
  );
  const filterPicked = useCallback(
    () => setActiveFilter('picked'),
    [setActiveFilter],
  );
  const filterMine = useCallback(
    () => setActiveFilter('mine'),
    [setActiveFilter],
  );

  return {
    filteredLeaderboard,
    filterAll,
    filterPicked,
    filterMine,
  };
}
