import { getGolferRanks } from "@/lib/getGolferRanks";
import { CheckSquare, User, X } from "lucide-react";
import { Params } from "next/dist/server/request/params";
import { SearchParams } from "next/dist/server/request/search-params";
import Image from "next/image";
import { PickButton } from "./_components/PickButton";
import { createClient } from "@/utils/supabase/server";

const GolferImage = ({ src, alt }: { src?: string, alt?: string }) => (
    <div className="overflow-hidden rounded-full w-[75px] bg-brand-blue aspect-square flex flex-col justify-end items-center">
        {src ? (
            <Image className="w-[150%] max-w-[150%]" src={src} alt={alt || "golfer image"} width={185} height={134} />
        ) : <User />}
    </div>
);

export default async function PickerPage({ searchParams, params }: { searchParams: SearchParams, params: Params }) {
    const { bucket } = await searchParams;
    const { public_id } = await params;
        const supabase = await createClient();
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('user_id').eq('public_id', public_id as string);
    const { data: rosterData, error: rosterError } = await supabase.from('picks').select('dg_rank').eq('user_id', profileData?.[0].user_id || "").eq('rank_bucket', bucket);
    const selectedDgRank = rosterData?.[0]?.dg_rank;
    const picks = await getGolferRanks(bucket);
    const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703515');
    const data = await res.json();
    const golfers = data.events[0].competitions[0].competitors.map(({ athlete }) => athlete);
    return (
        <>
            <div className="flex flex-col items-center justify-center mx-auto my-8 gap-2">
                <CheckSquare className="h-[36px] w-[36px] text-brand-green"/>
                <h1 className="text-4xl font-bold">Make Your Pick</h1>
                <h2 className="text-brand-blue">Rank: {bucket}</h2>
            </div>
            <div className="flex flex-col items-center justify-center">
                {picks.map((pick) => {
                    const [last, first] = pick.player_name.split(', ');
                    const golfer = golfers.find((g) => g.displayName.includes(last) && g.displayName.includes(first));
                    const isPicked = selectedDgRank === pick.dg_rank;
                    const isPickable = Boolean(golfer);

                    return (
                        <div className="flex items-center gap-2 border-b-2 border-b-gray-500 w-11/12 mb-4 px-2 pb-4" key={pick.player_name}>
                            {isPickable ? <GolferImage src={golfer.headshot?.href} alt={`${first} ${last}`} /> : <X className="w-[75px] h-[75px]"/>}
                            <div>
                                <div className="font-bold">{first} {last}</div>
                                <div className="grid grid-cols-[55px_auto] grid-rows-2">
                                    <div>DGR:</div><div>{pick.dg_rank}</div>
                                    <div>WGR:</div><div>{pick.owgr_rank}</div>
                                </div>
                            </div>
                            {(isPickable && !isPicked) && <PickButton golfer_id={golfer.id} bucket={bucket} rank={pick.dg_rank} redirectHref={`/user/${public_id}`}/>}
                            {isPicked && (<div className="ml-auto text-green-500 aspect-square h-[40px] grid place-content-center font-bold">PICKED</div>)}
                            {!isPickable && (<div className="ml-auto text-red-500 aspect-square h-[40px] grid place-content-center font-bold">OUT</div>)}
                        </div>
                    );
                })}
            </div>
        </>
    );
}