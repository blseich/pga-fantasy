import picks from '../data/picks.json';

type Player = {
  id: string,
  statistics: {
    name: string,
    displayName: string,
    value: 0,
  }[]
}

type Picker = {
  id: number,
  name: string,
  picks: {
    "1-10": string,
    "11-20": string,
    "21-40": string,
    "40+"?: string,
  }
}

const getScoreToPar = (player: Player) =>
  player.statistics.find((stat) => stat.name === 'scoreToPar')?.value || 0;

const displayScoreToPar = (score: number) => {
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  if (score < 0) return `${score}`;
}


export default async function Home() {
  const result = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703515', {cache: 'no-store'});
  const render = await result.json();

  const golfers = render.events[0].competitions[0].competitors;

  const golfersIdMap = golfers.reduce((acc: Record<string, Player>, player: Player) => ({
    ...acc,
    [player.id]: player,
  }), {});

  const calcOverallScore = (picks: Picker["picks"]) => {
    const players = Object.entries(picks).filter(([key, ]) => key !== 'out').map(([ ,pick]) => golfersIdMap[pick]);
    const sortedPlayers = players.sort((playerA, playerB) => getScoreToPar(playerA) - getScoreToPar(playerB));
    const scoredPlayers = sortedPlayers.slice(0, 3);
    return scoredPlayers.reduce((sum, player) => sum + getScoreToPar(player), 0);
  }

  return (
    <div className="p-4">
      {picks
        .sort((a_pick, b_pick) => (
          calcOverallScore(a_pick.picks) - calcOverallScore(b_pick.picks)
        ))
        .map((pick, i) => (
        <div className="mb-8 max-w-2xl mx-auto" key={`${pick.id}-${pick.name.replace(' ', '-')}`}>
          <div className='flex gap-4 p-4 bg-emerald-400 text-black font-bold rounded-t-2xl border-2 border-emerald-950'>
            <div className="shrink-0 grow-0">{i + 1}</div>
            <div className='text-center flex-grow'>{pick.name}</div>
            <div className="shrink-0 grow-0">Overall: {displayScoreToPar(calcOverallScore(pick.picks))}</div>
          </div>
          <div className="grid grid-cols-[1fr_50%_1fr_1fr] text-center gap-0.5 bg-emerald-950 border-2 border-emerald-950">
            <div className="bg-emerald-800 text-white">
                Rank
              </div>
              <div className="bg-emerald-800 text-white">
                Golfer
              </div>
              <div className="bg-emerald-800 text-white bl-">
                Today
              </div>
              <div className="bg-emerald-800 text-white">
                Overall
              </div>
          </div>
          <div className="grid grid-cols-[1fr_50%_1fr_1fr] text-center gap-0.5 bg-emerald-950 rounded-b-2xl border-2 border-emerald-950 overflow-hidden">
              {Object
                .entries(pick.picks)
                .filter(([key, ]) => key !== 'out')
                .map(([, pick]) => pick)
                .sort((a_id, b_id) => getScoreToPar(golfersIdMap[a_id]) - getScoreToPar(golfersIdMap[b_id]))
                .map((id, i) => (
                  <>
                    <div className={`p-2 text-ellipsis overflow-hidden grid items-center justify-center ${i === 3 ? 'bg-gray-300' : 'bg-white'}`}>{golfersIdMap[id].status.position.displayName}</div>
                    <div className={`p-2 text-ellipsis overflow-hidden grid items-center justify-center ${i === 3 ? 'bg-gray-300' : 'bg-white'}`}>{golfersIdMap[id].athlete.displayName}</div>
                    <div className={`p-2 text-ellipsis overflow-hidden grid items-center justify-center ${i === 3 ? 'bg-gray-300' : 'bg-white'}`}>{golfersIdMap[id].status.todayDetail || golfersIdMap[id].status.detail}</div>
                    <div className={`p-2 text-ellipsis overflow-hidden grid items-center justify-center ${i === 3 ? 'bg-gray-300' : 'bg-white'}`}>{golfersIdMap[id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar').displayValue}</div>
                  </>
              ))}
              {Object
                .entries(pick.picks)
                .filter(([key, ]) => key === 'out')
                .flatMap(([, pick]) => pick)
                .map((name) => (
                  <>
                    <div className={`bg-red-300 text-red-900 w-full p-2`}/>
                    <div className={`bg-red-300 text-red-900 w-full p-2`}>{name}</div>
                    <div className={`bg-red-300 text-red-900 w-full p-2`}/>
                    <div className={`bg-red-300 text-red-900 w-full p-2`}/>
                  </>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
