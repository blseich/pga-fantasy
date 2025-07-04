import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { tiebreaker_score } = await request.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tournament = await getTournament();
  if (user && tournament.tournamentStatus === 'NOT_STARTED') {
    const { data, error } = await supabase
      .from('tiebreakers')
      .upsert(
        { user_id: user?.id, tournament_id: tournament.id, tiebreaker_score },
        { onConflict: 'user_id,tournament_id' },
      );
    if (error) {
      console.log(error);
      return Response.json({ success: false });
    }
    return Response.json({ success: true, data });
  } else {
    return Response.json({ success: false });
  }
}
