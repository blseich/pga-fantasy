import Image from 'next/image';

import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';

export default async function Hero() {
  const tournament = await getTournament();

  return (
    <div
      className="hero mx-auto my-8 flex aspect-square w-11/12 flex-col items-center justify-center gap-2 px-8 py-16"
      style={{
        backgroundImage: `url(${tournament.beautyImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Image
        className="size-[72px] rounded-full"
        width={72}
        height={72}
        alt={tournament.tournamentName}
        src={tournament.tournamentLogo[0]}
        priority
      />
      <h1 className="text-center text-4xl font-bold">
        {tournament.tournamentName}
      </h1>
      <h2 className="text-center font-bold">
        {tournament.courses[0].courseName}
      </h2>
    </div>
  );
}
