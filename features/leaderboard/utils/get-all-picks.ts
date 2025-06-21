import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

export default async function getAllPicks() {
  const tournament = await getTournament();
  const supabase = await createClient();
  const { data } = await supabase
    .from('picks')
    .select('user_id,golfer_id,profile:profiles (first_name,last_name)')
    .eq('tournament_id', tournament.id);
  return data || [];
}
