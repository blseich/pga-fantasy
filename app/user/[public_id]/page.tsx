import { UserCircle2 } from 'lucide-react';

import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

import Tiebreaker from './_components/tiebreaker';
import './user.css';
import Headline from '@/app/_components/headline';
import RosterView from '@/features/roster-view';

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
      <Headline
        title={`${user?.first_name} ${user?.last_name}`}
        Icon={UserCircle2}
      />
      <h1 className="mb-4 mt-8 text-center text-2xl font-black">Tiebreaker</h1>
      <Tiebreaker
        initScore={tiebreakerScore}
        locked={tournament.tournamentStatus !== 'NOT_STARTED'}
      />
      <RosterView public_id={public_id} />
    </>
  );
}
