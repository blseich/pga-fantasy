import { UserCircle2 } from 'lucide-react';

import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

import Roster from './_components/roster';
import Tiebreaker from './_components/tiebreaker';
import './user.css';

export default async function UserPage({
  params,
}: {
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;
  const supabase = await createClient();
  const tournament = await getTournament();
  const { data } = await supabase
    .from('profiles')
    .select(
      'first_name, last_name, public_id, tiebreakers:tiebreakers (tiebreaker_score)',
    )
    .eq('public_id', public_id as string)
    .filter('tiebreakers.tournament_id', 'eq', tournament.id);
  const user = data?.[0];
  const tiebreakerScore = data?.[0].tiebreakers?.[0]?.tiebreaker_score;

  return (
    <>
      <div className="mx-auto my-8 flex flex-col items-center justify-center gap-2">
        <UserCircle2 className="size-[36px] text-gray-300" />
        <h1 className="text-4xl font-bold">
          {user?.first_name} {user?.last_name}
        </h1>
      </div>
      <h1 className="mb-4 mt-8 text-center text-2xl font-black">Tiebreaker</h1>
      <Tiebreaker
        initScore={tiebreakerScore}
        locked={tournament.tournamentStatus !== 'NOT_STARTED'}
      />
      <h2 className="mb-4 mt-8 text-center text-2xl font-black">Roster</h2>
      <Roster
        public_id={public_id as string}
        locked={tournament.tournamentStatus !== 'NOT_STARTED'}
      />
    </>
  );
}
