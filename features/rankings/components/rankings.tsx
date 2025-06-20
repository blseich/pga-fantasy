import generateRankings from '../utils/generate-rankings';
import RankingsDisplay from './rankings-display';

export default async function Rankings() {
  const rankings = await generateRankings();

  return <RankingsDisplay rankings={rankings} />;
}
