import { Leaderboard } from '@/lib/pga-endpoints/pga-data.types';
import { LeaderboardPick } from '../types/leaderboard-pick';

export default function getPickersForRow(
  picks: LeaderboardPick[],
  row: Leaderboard['players'][0],
) {
  return picks
    ?.filter((pick) => pick.golfer_id === row.player.id)
    .map((pick) => `${pick.profile.first_name} ${pick.profile.last_name}`)
    .join(', ');
}
