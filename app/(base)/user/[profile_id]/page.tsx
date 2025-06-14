import { createClient } from "@/utils/supabase/server";
import { Params } from "next/dist/server/request/params";

export default async function UserPage({ params }: { params: Params }) {
    const { profile_id } = await params;
    const supabase = await createClient();
    const { data: { user: loggedInUser }} = await supabase.auth.getUser();
    const { data } = await supabase.from('profiles').select().eq('public_id', profile_id);
    const user = data?.[0];
    
    return (
        <>
            <h1>{loggedInUser?.id === user.id ? 'Current User!' : 'Not Current User'}</h1>
            <h1>{user.first_name}</h1>
            <h1>{user.last_name}</h1>
        </>
    )
}