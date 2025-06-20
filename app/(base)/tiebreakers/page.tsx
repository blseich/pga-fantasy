import { EyeOff, Scale } from 'lucide-react';
import { Fragment } from 'react';

import {
  getLeaderboard,
  getTournament,
} from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

const numericScore = (score: string) =>
  score === 'E' ? 0 : Number.parseInt(score);

export default async function TiebreakerPage() {
  const supabase = await createClient();
  const tournament = await getTournament();
  const { data } = await supabase
    .from('tiebreakers')
    .select('tiebreaker_score, profile:profiles (first_name,last_name)')
    .eq('tournament_id', tournament.id);
  const leaderboard = await getLeaderboard();
  const leadingScoreValue = numericScore(
    leaderboard[0]?.scoringData.total || '0',
  );
  return (
    <>
      <div className="mx-auto my-8 flex flex-col items-center justify-center gap-2">
        <Scale className="size-[36px] text-brand-green" />
        <h1 className="text-4xl font-bold">Tiebreaker</h1>
        <h2 className="text-brand-blue">
          Current Leading Score: {leadingScoreValue || 'E'}
        </h2>
      </div>
      <div className="mx-auto grid w-10/12 grid-cols-[1fr_80px]">
        {data
          ?.sort(
            (a, b) =>
              Math.abs(a.tiebreaker_score || 0 - leadingScoreValue) -
              Math.abs(b.tiebreaker_score || 0 - leadingScoreValue),
          )
          .map(({ tiebreaker_score, profile: { first_name, last_name } }) => (
            <Fragment key={`${first_name}_${last_name}`}>
              <div className="p-4">
                {first_name} {last_name}
              </div>
              <div className="p-4 text-center">
                {tournament.tournamentStatus === 'NOT_STARTED' ? (
                  <EyeOff />
                ) : (
                  tiebreaker_score
                )}
              </div>
              <div className="col-span-2 mx-2 h-[2px] bg-gray-500" />
            </Fragment>
          ))}
      </div>
    </>
  );
}
