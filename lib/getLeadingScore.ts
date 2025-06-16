export default async function getLeadingScore() {
    const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga&region=us&lang=en&event=401703515');
    const event = await res.json();
    const leadingScore = event.events[0].competitions[0].competitors.reduce((acc: number, player: any) => {
        const currentPlayerScore = player.statistics.find((stat: { name: string }) => stat.name === 'scoreToPar')?.value || Number.POSITIVE_INFINITY;
        return currentPlayerScore < acc ? currentPlayerScore : acc
  }, Number.POSITIVE_INFINITY);
  return leadingScore;
};
