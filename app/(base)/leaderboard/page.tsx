import { TableProperties } from 'lucide-react';

import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';

import Headline from '@/components/headline';
import Leaderboard from '@/features/leaderboard';

export default async function LeaderboardPage() {
  const tournament = await getTournament();

  return (
    <>
      <Headline Icon={TableProperties} title="Leaderboard" />
      {tournament.tournamentStatus === 'NOT_STARTED' ? (
        <div className="my-8 px-4 text-center">
          <h1 className="text-2xl font-bold">Tournament Not Started</h1>
          <h2 className="text-red-400">
            Leaderboard will appear after selections are locked for this
            tournament
          </h2>
        </div>
      ) : (
        <Leaderboard />
      )}
    </>
  );
}
