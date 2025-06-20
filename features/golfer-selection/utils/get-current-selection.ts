import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

export default async function getCurrentSelection(
  bucket: string,
  public_id: string,
) {
  const tournament = await getTournament();
  const supabase = await createClient();
  const { data: rosterData } = await supabase
    .from('picks')
    .select('golfer_id, profiles!inner(public_id)')
    .eq('profiles.public_id', (public_id as string) || '')
    .eq('rank_bucket', bucket)
    .eq('tournament_id', tournament.id);
  return rosterData?.[0]?.golfer_id;
}
