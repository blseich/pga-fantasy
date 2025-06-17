import { getLeaderboard, getTournament } from "@/lib/pga-endpoints/getTournament";
import { createClient } from "@/utils/supabase/server";
import { TableProperties } from "lucide-react";
import { Fragment } from "react";
import LeaderboardDisplay from "./_components/LeaderboardDisplay";

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();
    const tournament = await getTournament();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('picks').select('user_id,golfer_id,profile:profiles (first_name,last_name)').eq('tournament_id', tournament.id);

    return (
        <>
            <div className="flex flex-col items-center justify-center mx-auto my-8 gap-2">
                <TableProperties className="h-[36px] w-[36px] text-gray-300"/>
                <h1 className="text-4xl font-bold">Leaderboard</h1>
            </div>
            <LeaderboardDisplay leaderboard={leaderboard} picks={data} user_id={user?.id} />
        </>
    );
}