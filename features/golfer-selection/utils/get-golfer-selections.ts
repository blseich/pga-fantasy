import { getField } from '@/lib/pga-endpoints/get-pga-endpoints';
import { getGolferRanks } from './get-golfer-rankings';

export default async function getGolferSelections(bucket: string) {
  const golferRankings = await getGolferRanks(bucket);
  const golfers = await getField();
  return golferRankings.map((rankedGolfer) => {
    const [last, first] = rankedGolfer.player_name.split(', ');
    const foundGolfer = golfers.find(
      (g) => g.lastName.includes(last) && g.firstName.includes(first),
    );
    return foundGolfer
      ? {
          ...foundGolfer,
          rank: {
            dg_rank: rankedGolfer.dg_rank,
            owgr_rank: rankedGolfer.owgr_rank,
          },
        }
      : rankedGolfer;
  });
}
