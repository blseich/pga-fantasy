import { createClient } from '@/utils/supabase/server';
import './home.css';
import Rankings from './_components/Rankings';
import { Tables } from '@/utils/supabase/database.types';

type UserWithPicks = Pick<Tables<'profiles'>, 'first_name' | 'last_name' | 'public_id'> & { picks: Tables<'picks'>[] }
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
    }
}

const generateRankings = (users: UserWithPicks[], event): UserWithPickDetails[] => {
  const golfersIdMap = event.competitions[0].competitors.reduce((acc: Record<string, any>, player: any) => ({
    ...acc,
    [player.id]: player,
  }), {});
  const rankings = users.map((user) => {
    const picksWithScores = user.picks.map((pick) => ({
      ...pick,
      golfer: {
        first_name: golfersIdMap[pick.golfer_id].athlete.displayName.split(' ')[0],
        last_name: golfersIdMap[pick.golfer_id].athlete.lastName,
        headshot: golfersIdMap[pick.golfer_id].athlete.headshot.href,
      },
      score: {
        today: golfersIdMap[pick.golfer_id].status.todayDetail || golfersIdMap[pick.golfer_id].status.detail,
        overall: golfersIdMap[pick.golfer_id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar')
      }
    })).sort((pickA, pickB) => pickA.score.overall.value - pickB.score.overall.value);
    return {
      ...user,
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
  return rankings;
}

export default async function Home() {
  const supabase = await createClient();
  const { data: users } = await supabase.from('profiles').select('first_name, last_name, public_id, picks:picks (*)');
  const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703515');
  const event = await res.json();
  const rankings = generateRankings(users || [], event.events[0]);
  console.log(rankings[0].picks);
  return (
    <div className="w-full max-w-screen-md p-4 flex flex-col gap-4 items-center">
      <Rankings users={rankings || []} event={event}/>
    </div>
  );
}
