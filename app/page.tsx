import { createClient } from '@/utils/supabase/server';
import './home.css';
import Rankings from './_components/Rankings/index';
import { Tables } from '@/utils/supabase/database.types';
import { getLeaderboard, getTournament } from '@/lib/pga-endpoints/getPgaEndpoints';
import Image from 'next/image';
import Countdown from './_components/Countdown';
import { Leaderboard } from '@/lib/pga-endpoints/pgaData.types';

type UserWithPicks = Pick<Tables<'profiles'>, 'user_id' | 'first_name' | 'last_name' | 'public_id'> & { picks: Tables<'picks'>[] } & { tiebreakers: { tiebreaker_score: number }[] | null }
type PickWithDetails = Tables<'picks'> & {
  golfer: {
    first_name: string,
    last_name: string,
    headshot: string,
  },
  score: {
    today: string,
    overall: {
      value: number,
      displayValue: string,
    }
  }
}
export type UserWithPickDetails = Pick<Tables<'profiles'>, 'first_name' | 'last_name' | 'public_id'> & { 
    picks: PickWithDetails[];
    score: {
      value: number,
      displayValue: string,
    };
    me: boolean;
}

const numericScore = (score: string) => (
  score === 'E' ? 0 : Number.parseInt(score)
);

const defaultGolfer = {
  player: {
    id: '',
    firstName: '',
    lastName: ''
  },
  scoringData: {
    teeTime: null,
    position: 'WD',
    score: '-',
    thru: '-',
    total: 'E',
  }
};

const generateRankings = (users: UserWithPicks[], leaderboard: Leaderboard["players"], activeUser: { id: string } | null): UserWithPickDetails[] => {
  const leadingScore = Number.parseInt(leaderboard[0].scoringData.total);
  const rankings = users.map((user) => {
    const picksWithScores = user.picks.map((pick) => {
      const golfer = leaderboard.find((entry) => entry.player?.id === pick.golfer_id) || defaultGolfer;
      return {
        ...pick,
        golfer: {
          first_name: golfer.player.firstName,
          last_name: golfer.player.lastName,
          headshot: `https://pga-tour-res.cloudinary.com/image/upload/headshots_${golfer.player.id}.png`,
        },
        score: {
          today: golfer.scoringData.position === 'CUT' ? 'CUT' :
            golfer.scoringData.thru === "" ? golfer.scoringData.teeTime || '' :
            `${golfer.scoringData.score} (${golfer.scoringData.thru})`,
          overall: {
            displayValue: golfer.scoringData.total,
            value: numericScore(golfer.scoringData.total),
          }
        }
      }
    }).sort((pickA, pickB) => pickA.score.overall.value - pickB.score.overall.value);
    return {
      ...user,
      me: user.user_id === activeUser?.id,
      picks: picksWithScores,
      score: picksWithScores.slice(0, 3).reduce((acc, pick) => {
        const newScore = acc.value + pick.score.overall.value;
        return {
          value: newScore,
          displayValue: newScore === 0 ? 'E':
            newScore > 0 ? `+${newScore}` : 
              `${newScore}`,
        }
      }, { value: 0, displayValue: 'E'})
    };
  });
  return rankings.sort((userA, userB) => userA.score.value - userB.score.value || Math.abs(userA.tiebreakers?.[0]?.tiebreaker_score || 0 - leadingScore) - Math.abs(userB.tiebreakers?.[0]?.tiebreaker_score || 0 - leadingScore));
}

const getTargetDate = (date: string) => {
  const [month, firstDay, dash, secondDay, year] = date.split(" ");
  return new Date(`${month} ${firstDay}, ${year} 06:00:00 EST`);
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user }} = await supabase.auth.getUser();
  const tournament = await getTournament();
  const leaderboard = await getLeaderboard();
  const { data: users } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name, public_id, picks:picks (*), tiebreakers:tiebreakers (tiebreaker_score)')
    .filter('picks.tournament_id', 'eq', tournament.id)
    .filter('tiebreakers.tournament_id', 'eq', tournament.id);

  return (
    <>
      <div className="hero flex flex-col items-center justify-center mx-auto my-8 gap-2 py-16 px-8 aspect-square w-11/12" style={{ backgroundImage: `url(${tournament.beautyImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <Image className="h-[72px] w-[72px] rounded-full" width={72} height={72} alt={tournament.tournamentName} src={tournament.tournamentLogo[0]} priority/>
        <h1 className="text-4xl font-bold text-center">{tournament.tournamentName}</h1>
        <h2 className="text-center font-bold">{tournament.courses[0].courseName}</h2>
      </div>
      {tournament.tournamentStatus === 'NOT_STARTED'
          ? <Countdown targetDate={getTargetDate(tournament.displayDate)} pickLink={`/user/${users?.find((u) => u.user_id === user?.id)?.public_id}`}/>
          : <Rankings users={generateRankings(users || [], leaderboard, user)} />}
    </>
  );
}
