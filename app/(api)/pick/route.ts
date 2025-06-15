import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const { golfer_id, rank_bucket, dg_rank } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data, error } = await supabase.from('picks').upsert({ id: user?.id, golfer_id, rank_bucket, dg_rank }, { onConflict: 'id, rank_bucket' });
        if (error) {
            console.log(error);
            return Response.json({ success: false });
        }
        return Response.json({ success: true, data });
    } else {
        return Response.json({ success: false });
    }
}
