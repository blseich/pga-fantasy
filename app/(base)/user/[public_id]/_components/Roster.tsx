import { getGolferRanks } from "@/lib/getGolferRanks";
import { createClient } from "@/utils/supabase/server";
import SelectedGolfer from "./SelectedGolfer";
import UnselectedGolfer from "./UnselectedGolfer";

export default async function RosterPage({ public_id }: { public_id: string }) {
    const supabase = await createClient();
    const { data } = await supabase.from('profiles').select('picks:picks (*)').eq('public_id', public_id as string);
    const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703515');
    const golferData = (await res.json()).events[0].competitions[0].competitors;
    const rosterData = data?.[0].picks || []
    const rankData = await getGolferRanks();
    return (
        <>
            {['1-10', '11-20', '21-40', '41+']
                .map((bucket) => {
                    const swapLink = `/user/${public_id}/picker?bucket=${bucket.replace('+','%2B')}`;
                    const pick = rosterData?.find((pick) => pick.rank_bucket === bucket);
                    if (!pick) {
                        return <UnselectedGolfer key={bucket}rank_bucket={bucket} swapLink={swapLink} />
                    }
                    const golfer = golferData.find((golfer) => golfer.id === pick.golfer_id);
                    const rank = rankData.find((rank) => rank.dg_rank === pick.dg_rank);
                    return <SelectedGolfer
                        key={`${public_id}:${pick.golfer_id}`}
                        swapLink={swapLink}
                        golfer={golfer.athlete}
                        rank_bucket={pick.rank_bucket}
                        rank={rank}
                        score={{
                            today: golfer.status.todayDetail || golfer.status.detail,
                            overall: golfer.statistics.find((stat: { name: string }) => stat.name === 'scoreToPar')?.displayValue || 0
                        }}
                        locked={true}
                    />
                })
            }
        </>
    );
}