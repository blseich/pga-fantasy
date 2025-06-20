import { type UserWithPickDetails } from '@/types/db-fetched-types';
import {
  getLeaderboard,
  getTournament,
} from '@/lib/pga-endpoints/get-pga-endpoints';
import { Leaderboard } from '@/lib/pga-endpoints/pga-data.types';
import { Tables } from '@/utils/supabase/database.types';
import { createClient } from '@/utils/supabase/server';

const defaultGolfer = {
  player: {
    id: '',
    firstName: '',
    lastName: '',
  },
  scoringData: {
    teeTime: null,
    position: 'WD',
    score: '-',
    thru: '-',
    total: 'E',
    playerState: 'WITHDRAWN',
  },
};

type UserWithPicksAndTiebreakerScore = Omit<
  Tables<'profiles'>,
  'created_at'
> & {
  picks: Tables<'picks'>[];
} & {
  tiebreakers: Pick<Tables<'tiebreakers'>, 'tiebreaker_score'>[];
};

const numericScore = (score: string) =>
  score === 'E' ? 0 : Number.parseInt(score);

const displayScore = (score: number) =>
  score === 0 ? 'E' : score > 0 ? `+${score}` : `${score}`;

const buildGolferScore = (
  golfer: Pick<Leaderboard['players'][0], 'scoringData'>,
) => {
  let today = golfer.scoringData.teeTime || '';
  if (golfer.scoringData.thru !== '')
    today = `${golfer.scoringData.score} (${golfer.scoringData.thru})`;
  if (golfer.scoringData.position === 'CUT') today = 'CUT';

  return {
    today,
    overall: {
      displayValue: golfer.scoringData.total,
      value: numericScore(golfer.scoringData.total),
    },
  };
};

const buildGolfer = (golfer: Pick<Leaderboard['players'][0], 'player'>) => ({
  first_name: golfer.player.firstName,
  last_name: golfer.player.lastName,
  headshot: `https://pga-tour-res.cloudinary.com/image/upload/headshots_${golfer.player.id}.png`,
});

const buildUserPicks = (
  user: UserWithPicksAndTiebreakerScore | null,
  leaderboard: Leaderboard['players'],
) => {
  return (
    user?.picks
      .map((pick) => {
        const golfer =
          leaderboard.find((entry) => entry.player?.id === pick.golfer_id) ||
          defaultGolfer;
        return {
          ...pick,
          golfer: buildGolfer(golfer),
          score: buildGolferScore(golfer),
        };
      })
      .sort(
        (pickA, pickB) => pickA.score.overall.value - pickB.score.overall.value,
      ) || []
  );
};

const compileScore = (userPicks: ReturnType<typeof buildUserPicks>) => {
  const accumulatedScore = userPicks
    .slice(0, 3)
    .map((pick) => pick.score.overall.value)
    .reduce((acc, score) => (acc += score), 0);
  return {
    value: accumulatedScore,
    displayValue: displayScore(accumulatedScore),
  };
};

export default async function generateRankings(): Promise<
  UserWithPickDetails[]
> {
  const supabase = await createClient();
  const {
    data: { user: activeUser },
  } = await supabase.auth.getUser();
  const tournament = await getTournament();
  const leaderboard = await getLeaderboard();
  const { data: users } = await supabase
    .from('profiles')
    .select(
      'user_id, first_name, last_name, public_id, picks:picks (*), tiebreakers:tiebreakers (tiebreaker_score)',
    )
    .filter('picks.tournament_id', 'eq', tournament.id)
    .filter('tiebreakers.tournament_id', 'eq', tournament.id);

  const leadingScore = Number.parseInt(leaderboard[0].scoringData.total);

  const rankings =
    users?.map((user) => {
      const picksWithScores = buildUserPicks(user, leaderboard);
      return {
        ...user,
        me: user.user_id === activeUser?.id,
        picks: picksWithScores,
        score: compileScore(picksWithScores),
      };
    }) || [];

  return rankings.sort(
    (userA, userB) =>
      userA.score.value - userB.score.value ||
      Math.abs(userA.tiebreakers?.[0]?.tiebreaker_score || 0 - leadingScore) -
        Math.abs(userB.tiebreakers?.[0]?.tiebreaker_score || 0 - leadingScore),
  );
}
