import { getGolferRanks } from '@/features/golfer-selection/utils/get-golfer-rankings';
import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';
import { type PickMap } from '../types/pick-map';

export default async function getUserPicks(public_id: string) {
  const supabase = await createClient();
  const tournament = await getTournament();
  const rankData = await getGolferRanks();
  const { data } = await supabase
    .from('profiles')
    .select('picks:picks (*)')
    .eq('public_id', public_id as string)
    .filter('picks.tournament_id', 'eq', tournament.id)
    .single();
  const rosterData = data?.picks || [];
  return rosterData.reduce(
    (acc, pick) => ({
      ...acc,
      [pick.rank_bucket]: {
        ...pick,
        ...(rankData.find((rank) => rank.dg_rank === pick.dg_rank) || {
          dg_rank: '-',
          owgr_rank: '-',
        }),
      },
    }),
    {} as PickMap,
  );
}
