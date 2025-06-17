import { getTournament } from "@/lib/pga-endpoints/getPgaEndpoints";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const { golfer_id, rank_bucket, dg_rank } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const tournament = await getTournament();
    if (user && tournament.tournamentStatus === 'NOT_STARTED') {
        const { data, error } = await supabase.from('picks').upsert({ user_id: user?.id, golfer_id, rank_bucket, dg_rank, tournament_id: tournament.id }, { onConflict: 'user_id,rank_bucket,tournament_id' });
        if (error) {
            console.log(error);
            return Response.json({ success: false });
        }
        return Response.json({ success: true, data });
    } else {
        return Response.json({ success: false });
    }
}
