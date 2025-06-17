import { createClient } from "@/utils/supabase/server";
import { Params } from "next/dist/server/request/params";
import Roster from './_components/Roster';
import Tiebreaker from "./_components/Tiebreaker";
import { UserCircle2 } from "lucide-react";
import { getTournament } from "@/lib/pga-endpoints/getTournament";

export default async function UserPage({ params }: { params: Params }) {
    const { public_id } = await params;
    const supabase = await createClient();
    const tournament = await getTournament();
    const { data } = await supabase.from('profiles').select('first_name, last_name, public_id, tiebreakers:tiebreakers (tiebreaker_score)').eq('public_id', public_id as string).filter('tiebreakers.tournament_id', 'eq', tournament.id);
    const user = data?.[0];
    const tiebreakerScore = data?.[0].tiebreakers?.[0]?.tiebreaker_score || 0;
    console.log(tiebreakerScore);
    return (
        <>
            <div className="flex flex-col items-center justify-center mx-auto my-8 gap-2">
                <UserCircle2 className="h-[36px] w-[36px] text-gray-300"/>
                <h1 className="text-4xl font-bold">{user?.first_name} {user?.last_name}</h1>
            </div>
            <h1 className="text-2xl font-black mt-8 mb-4 text-center">Tiebreaker</h1>
            <Tiebreaker initScore={tiebreakerScore} locked={tournament.tournamentStatus !== 'NOT_STARTED'}/>
            <h2 className="text-2xl font-black mt-8 mb-4 text-center">Roster</h2>
            <Roster public_id={public_id as string} locked={tournament.tournamentStatus !== 'NOT_STARTED'} />
        </>
    )
}