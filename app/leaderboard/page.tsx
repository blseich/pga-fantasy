import { getLeaderboard, getTournament } from "@/lib/pga-endpoints/getPgaEndpoints";
import { createClient } from "@/utils/supabase/server";
import { TableProperties } from "lucide-react";
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
            {tournament.tournamentStatus === 'NOT_STARTED' ? (
                <div className="text-center my-8 px-4">
                    <h1 className="text-2xl font-bold">Tournament Not Started</h1>
                    <h2 className="text-red-400">Leaderboard will appear after selections are locked for this tournament</h2>
                </div>
            ): (
                <LeaderboardDisplay leaderboard={leaderboard} picks={data || []} user_id={user?.id} />
            )}
        </>
    );
}