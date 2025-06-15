import { getGolferRanks } from "@/lib/getGolferRanks";
import { Params } from "next/dist/server/request/params";
import { ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const Golfer = ({ golfer, rank_bucket, rank, score, swapLink }) => {
    const [first, ...last] = golfer.displayName.split(' ');
    return (
        <div className="border-b-2 w-full mb-4 flex gap-2 pb-2 items-end">
            <div className="relative h-24 w-24 flex flex-col justify-end overflow-hidden">
                <Image className="absolute max-w-48 -z-10 -left-1/4" src={golfer.headshot.href} width="145" height="295" alt="Scottie Scheffler" />
                <div className="bottom-0 w-full bg-brand-blue text-black text-sm text-center">{rank_bucket}</div>
            </div>
            <div className="grow grid grid-cols-[auto_85px] grid-rows-[auto_40px] gap-x-2 gap-y-4 pr-2">
                <div>
                    <div className="text-sm">{first}</div>
                    <div className="text-2xl">{last.join(' ')}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm">{score.today}</div>
                    <div className="text-lg text-brand-green">{score.overall}</div>
                </div>
                <div className="grid grid-cols-[55px_auto] grid-rows-[auto_auto] gap-x-2 text-xs h-[40px] items-end">
                    <div>DG Rank:</div><div>{rank.dg_rank}</div>
                    <div>WG Rank:</div><div>{rank.owgr_rank}</div>
                </div>

                <Link href={swapLink} className="bg-yellow-300 text-black px-4 py-2 rounded-lg mx-auto"><ArrowRightLeft/></Link>
            </div>
        </div>
    );
}

export default async function RosterPage({ params }: { params: Params }) {
    const { public_id } = await params;
    const supabase = await createClient();
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('user_id').eq('public_id', public_id as string);
    const { data: rosterData, error: rosterError } = await supabase.from('picks').select('golfer_id,rank_bucket,dg_rank').eq('user_id', profileData?.[0].user_id || "");
    const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703515');
    const golferData = (await res.json()).events[0].competitions[0].competitors;
    const rankData = await getGolferRanks();
    return (
        <>
            <h1 className="text-2xl font-black my-8">Your Roster</h1>
            {rosterData?.sort((a, b) => parseInt(a.dg_rank) - parseInt(b.dg_rank))
                .map((pick) => {
                    const golfer = golferData.find((golfer) => golfer.id === pick.golfer_id);
                    const rank = rankData.find((rank) => rank.dg_rank === pick.dg_rank);
                    return <Golfer
                        key={`${public_id}:${pick.golfer_id}`}
                        swapLink={`/user/${public_id}/picker?bucket=${pick.rank_bucket.replace('+','%2B')}`}
                        golfer={golfer.athlete}
                        rank_bucket={pick.rank_bucket}
                        rank={rank}
                        score={{
                            today: golfer.status.todayDetail || golfer.status.detail,
                            overall: golfer.statistics.find((stat: { name: string }) => stat.name === 'scoreToPar')?.displayValue || 0
                        }}
                    />
                })
            }
        </>
    );
}