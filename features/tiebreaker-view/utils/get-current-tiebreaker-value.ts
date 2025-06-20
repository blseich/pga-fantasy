import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

export default async function getCurrentTiebreakerValue(public_id: string) {
  const supabase = await createClient();
  const tournament = await getTournament();
  const { data } = await supabase
    .from('profiles')
    .select('tiebreakers:tiebreakers (tiebreaker_score)')
    .eq('public_id', public_id)
    .filter('tiebreakers.tournament_id', 'eq', tournament.id)
    .single();
  return data?.tiebreakers[0].tiebreaker_score;
}
