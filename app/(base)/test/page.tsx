import { getGolferRanks } from "@/lib/getGolferRanks";
import { createClient } from "@/utils/supabase/server";

export default async function TestPage() {
    const supabase = await createClient();
    const rankings = await getGolferRanks();

    let { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')

    console.log(error);
    console.log(profiles);

    return (
        <main>
            {profiles?.map(({username}, i) => (
                <div key={username + i}>Username: {username}</div>
            ))}
            <div>{JSON.stringify(rankings)}</div>
        </main>
    )
}