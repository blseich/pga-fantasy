import { PropsWithChildren } from 'react';

import { getGolferRanks } from '@/lib/get-golfer-ranks';
import {
  getField,
  getLeaderboard,
  getTournament,
} from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

import SelectedGolfer from './selected-golfer';
import UnselectedGolfer from './unselected-golfer';

const PickWrapper = ({
  children,
  index,
}: PropsWithChildren<{ index: number }>) => (
  <div className="pick" style={{ ['--i' as any]: index }}>
    {children}
  </div>
);

export default async function RosterPage({
  public_id,
  locked,
}: {
  public_id: string;
  locked: boolean;
}) {
  const supabase = await createClient();
  const tournament = await getTournament();
  const { data } = await supabase
    .from('profiles')
    .select('picks:picks (*)')
    .eq('public_id', public_id as string)
    .filter('picks.tournament_id', 'eq', tournament.id);
  const rosterData = data?.[0].picks || [];
  const rankData = await getGolferRanks();
  const golfers = !locked ? await getField() : await getLeaderboard();
  return (
    <>
      {['1-10', '11-20', '21-40', '41+'].map((bucket, i) => {
        const swapLink = `/user/${public_id}/picker?bucket=${bucket.replace('+', '%2B')}`;
        const pick = rosterData?.find((pick) => pick.rank_bucket === bucket);
        if (!pick) {
          return (
            <PickWrapper index={i} key={bucket}>
              <UnselectedGolfer rank_bucket={bucket} swapLink={swapLink} />
            </PickWrapper>
          );
        }
        const rank = rankData.find((rank) => rank.dg_rank === pick.dg_rank) || {
          dg_rank: '-',
          owgr_rank: '-',
        };
        const golfer = golfers.find((golfer) => {
          if ('player' in golfer) {
            return golfer.player.id === pick.golfer_id;
          } else {
            return golfer.id === pick.golfer_id;
          }
        });

        if (!golfer) return null;

        return (
          <PickWrapper index={i} key={`${public_id}:${pick.golfer_id}`}>
            <SelectedGolfer
              swapLink={swapLink}
              golfer={'player' in golfer ? golfer.player : golfer}
              scoringData={
                'scoringData' in golfer ? golfer.scoringData : undefined
              }
              rank_bucket={pick.rank_bucket}
              rank={rank}
            />
          </PickWrapper>
        );
      })}
    </>
  );
}
