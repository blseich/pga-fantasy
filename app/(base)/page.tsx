import { createClient } from '@/utils/supabase/server';
import './home.css';
import Rankings from './_components/Rankings';
import { Tables } from '@/utils/supabase/database.types';
import { Trophy } from 'lucide-react';

type UserWithPicks = Pick<Tables<'profiles'>, 'first_name' | 'last_name' | 'public_id'> & { picks: Tables<'picks'>[] } & { tiebreakers: { tiebreaker_score: number } | null }
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
    
}

const generateRankings = (users: UserWithPicks[], event): UserWithPickDetails[] => {
  const golfersIdMap = event.competitions[0].competitors.reduce((acc: Record<string, any>, player: any) => ({
    ...acc,
    [player.id]: player,
  }), {});
  const leadingScore = event.competitions[0].competitors.reduce((acc: number, player: any) => {
        const currentPlayerScore = player.statistics.find((stat: { name: string }) => stat.name === 'scoreToPar')?.value || Number.POSITIVE_INFINITY;
        return currentPlayerScore < acc ? currentPlayerScore : acc
  }, Number.POSITIVE_INFINITY);
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
  return rankings.sort((userA, userB) => userA.score.value - userB.score.value || Math.abs(userA.tiebreakers?.tiebreaker_score || 0 - leadingScore) - Math.abs(userB.tiebreakers?.tiebreaker_score || 0 - leadingScore));
}

export default async function Home() {
  const supabase = await createClient();
  const { data: users } = await supabase.from('profiles').select('first_name, last_name, public_id, picks:picks (*), tiebreakers:tiebreakers (tiebreaker_score)');
  const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703515');
  const event = await res.json();
  const rankings = generateRankings(users || [], event.events[0]);

  return (
    <>
      <div className="flex flex-col items-center justify-center mx-auto my-8 gap-2">
        <Trophy className="h-[36px] w-[36px] text-yellow-300"/>
        <h1 className="text-4xl font-bold">{event.events[0].name}</h1>
        <h2 className="text-brand-blue">{event.events[0].courses[0].name}</h2>
      </div>
      <div className="w-full max-w-screen-md p-4 flex flex-col gap-4 items-center">
        <Rankings users={rankings || []} event={event}/>
      </div>
    </>
  );
}
