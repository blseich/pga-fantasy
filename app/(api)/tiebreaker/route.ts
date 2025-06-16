import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const { tiebreaker_score} = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data, error } = await supabase.from('tiebreakers').upsert({ user_id: user?.id, tiebreaker_score }, { onConflict: 'user_id' });
        if (error) {
            console.log(error);
            return Response.json({ success: false });
        }
        return Response.json({ success: true, data });
    } else {
        return Response.json({ success: false });
    }
}
