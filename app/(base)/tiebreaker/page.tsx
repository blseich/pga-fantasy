import { getLeaderboard } from "@/lib/pga-endpoints/getTournament";
import { createClient } from "@/utils/supabase/server";
import { Scale } from "lucide-react";
import { Fragment } from "react";

const numericScore = (score: string) => (
  score === 'E' ? 0 : Number.parseInt(score)
);

export default async function TiebreakerPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('profiles').select('first_name,last_name,tiebreakers:tiebreakers (tiebreaker_score) ');
    const leaderboard = await getLeaderboard();
    const leadingScoreValue = numericScore(leaderboard?.players?.[0]?.scoringData?.total || "0");

    return (
        <>
            <div className="flex flex-col items-center justify-center mx-auto my-8 gap-2">
                <Scale className="h-[36px] w-[36px] text-brand-green"/>
                <h1 className="text-4xl font-bold">Tiebreaker</h1>
                <h2 className="text-brand-blue">Current Leading Score: {leaderboard?.players?.[0]?.scoringData?.total || 'E'}</h2>
            </div>
            <div className="grid grid-cols-[1fr_80px] w-10/12 mx-auto">
                {data?.sort((userA, userB) => Math.abs(userA.tiebreakers?.tiebreaker_score || 0 - leadingScoreValue) - Math.abs(userB.tiebreakers?.tiebreaker_score || 0 - leadingScoreValue))
                    .map(({ first_name, last_name, tiebreakers }) => (
                        <Fragment key={`${first_name}_${last_name}`}>
                            <div className="p-4">{first_name} {last_name}</div>
                            <div className="p-4">{tiebreakers?.tiebreaker_score}</div>
                            <div className="h-[2px] bg-gray-500 col-span-2 mx-2"/>
                        </Fragment>
                    ))}
            </div>
        </>
    )
}