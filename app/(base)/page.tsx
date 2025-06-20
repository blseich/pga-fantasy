import Countdown from '@/features/countdown';
import Rankings from '@/features/rankings';
import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';

import Hero from './_components/hero';

import './home.css';

export default async function Home() {
  const tournament = await getTournament();

  return (
    <>
      <Hero />
      {tournament.tournamentStatus === 'NOT_STARTED' ? (
        <Countdown />
      ) : (
        <Rankings />
      )}
    </>
  );
}
