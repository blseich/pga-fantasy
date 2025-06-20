import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';

export default async function getTargetDate() {
  const tournament = await getTournament();
  const [month, firstDay, _dash, _secondDay, year] =
    tournament.displayDate.split(' ');
  return new Date(`${month} ${firstDay}, ${year} 06:00:00 EST`);
}
