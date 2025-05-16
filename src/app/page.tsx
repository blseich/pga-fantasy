import picks from '../data/picks.json';

type Player = {
  id: string,
}

const scoreToInt = (score: string) => score === 'E' ? 0 : parseInt(score);

const parseScore = (score: number) => {
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  if (score < 0) return `${score}`;
  return 0;
}

export default async function Home() {
  const result = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703511');
  const render = await result.json();

  const golfers = render.events[0].competitions[0].competitors;

  const golfersIdMap = golfers.reduce((acc: Record<string, Player>, player: Player) => ({
    ...acc,
    [player.id]: player,
  }), {});

  return (
    <div className="p-4">
      {/* {golfers.map((player) => (
        <div className="flex">
          <div>{player.score}</div>
          <div>{player.athlete.fullName}</div>
        </div>
      ))} */}
      {picks
        .sort((a_pick, b_pick) => (
          Object.values(a_pick.picks).reduce((acc, id) => acc + scoreToInt(golfersIdMap[id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar').displayValue), 0) -  Object.values(b_pick.picks).reduce((acc, id) => acc + scoreToInt(golfersIdMap[id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar').displayValue), 0)
        ))
        .map((pick, i) => (
        <div className="mb-8 max-w-2xl mx-auto" key={`${pick.id}-${pick.name.replace(' ', '-')}`}>
          <div className='flex gap-4 p-4 bg-emerald-400 text-black font-bold rounded-t-2xl border-2 border-emerald-950'>
            <div className="shrink-0 grow-0">{i + 1}</div>
            <div className='text-center flex-grow'>{pick.name}</div>
            <div className="shrink-0 grow-0">Overall: {parseScore(Object.values(pick.picks).reduce((acc, id) => acc + scoreToInt(golfersIdMap[id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar').displayValue), 0))}</div>
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
          <div className="grid grid-cols-[1fr_50%_1fr_1fr] text-center gap-0.5 bg-emerald-950 [&>div]:bg-white  rounded-b-2xl border-2 border-emerald-950 overflow-hidden">
              {Object
                .values(pick.picks)
                .sort((a_id, b_id) => scoreToInt(golfersIdMap[a_id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar').displayValue) - scoreToInt(golfersIdMap[b_id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar').displayValue))
                .map((id) => (
                  <>
                    <div className="p-2 text-ellipsis overflow-hidden grid items-center justify-center">{golfersIdMap[id].status.position.displayName}</div>
                    <div className="p-2 text-ellipsis overflow-hidden grid items-center justify-center">{golfersIdMap[id].athlete.displayName}</div>
                    <div className="p-2 text-ellipsis overflow-hidden grid items-center justify-center">{golfersIdMap[id].status.todayDetail || golfersIdMap[id].status.detail}</div>
                    <div className="p-2 text-ellipsis overflow-hidden grid items-center justify-center">{golfersIdMap[id].statistics.find((stat: { name: string }) => stat.name === 'scoreToPar').displayValue}</div>
                  </>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
