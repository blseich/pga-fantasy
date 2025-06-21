import { getLeaderboard } from '@/lib/pga-endpoints/get-pga-endpoints';
import getAllPicks from '../utils/get-all-picks';
import getCurrentUser from '../utils/get-current-user';
import LeaderboardDisplay from './leaderboard-display';

export default async function Leaderboard() {
  const leaderboard = await getLeaderboard();
  const user = await getCurrentUser();
  const picks = await getAllPicks();

  return (
    <LeaderboardDisplay
      leaderboard={leaderboard}
      user_id={user?.id}
      picks={picks}
    />
  );
}
