import { CheckSquare, User, X } from 'lucide-react';
import Image from 'next/image';

import { getGolferRanks } from '@/lib/get-golfer-ranks';
import { getField, getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

import { PickButton } from './_components/pick-button';

const GolferImage = ({ src, alt }: { src?: string; alt?: string }) => (
  <div className="flex aspect-square w-[75px] flex-col items-center justify-end overflow-hidden rounded-full bg-brand-blue">
    {src ? (
      <Image
        className="w-[150%] max-w-[150%]"
        src={src}
        alt={alt || 'golfer image'}
        width={185}
        height={134}
      />
    ) : (
      <User />
    )}
  </div>
);

export default async function PickerPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ bucket: string }>;
  params: Promise<{ public_id: string }>;
}) {
  const { bucket } = await searchParams;
  const { public_id } = await params;
  const tournament = await getTournament();
  const supabase = await createClient();
  const { data: rosterData } = await supabase
    .from('picks')
    .select('dg_rank, profiles!inner(public_id)')
    .eq('profiles.public_id', (public_id as string) || '')
    .eq('rank_bucket', bucket)
    .eq('tournament_id', tournament.id);
  const selectedDgRank = rosterData?.[0]?.dg_rank;
  const picks = await getGolferRanks(bucket);
  const golfers = await getField();

  if (tournament.tournamentStatus !== 'NOT_STARTED') {
    return (
      <div className="my-8 text-center">
        <h1 className="text-2xl font-bold">Tournament Underway</h1>
        <h2 className="text-red-400">Roster changes are no long permitted</h2>
      </div>
    );
  }
  return (
    <>
      <div className="mx-auto my-8 flex flex-col items-center justify-center gap-2">
        <CheckSquare className="size-[36px] text-brand-green" />
        <h1 className="text-4xl font-bold">Make Your Pick</h1>
        <h2 className="text-brand-blue">Rank: {bucket}</h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        {picks.map((pick) => {
          const [last, first] = pick.player_name.split(', ');
          const golfer = golfers.find(
            (g) => g.lastName.includes(last) && g.firstName.includes(first),
          );
          const isPicked = selectedDgRank === pick.dg_rank;
          const isPickable = golfer !== undefined;

          return (
            <div
              className="mb-4 flex w-11/12 items-center gap-2 border-b-2 border-b-gray-500 px-2 pb-4"
              key={pick.player_name}
            >
              {isPickable ? (
                <GolferImage
                  src={`https://pga-tour-res.cloudinary.com/image/upload/headshots_${golfer.id}.png`}
                  alt={`${first} ${last}`}
                />
              ) : (
                <X className="size-[75px]" />
              )}
              <div>
                <div className="font-bold">
                  {first} {last}
                </div>
                <div className="grid grid-cols-[55px_auto] grid-rows-2">
                  <div>DGR:</div>
                  <div>{pick.dg_rank}</div>
                  <div>WGR:</div>
                  <div>{pick.owgr_rank}</div>
                </div>
              </div>
              {isPickable && !isPicked && (
                <PickButton
                  golfer_id={golfer.id}
                  bucket={bucket}
                  rank={pick.dg_rank}
                  redirectHref={`/user/${public_id}`}
                />
              )}
              {isPicked && (
                <div className="ml-auto grid aspect-square h-[40px] place-content-center font-bold text-green-500">
                  PICKED
                </div>
              )}
              {!isPickable && (
                <div className="ml-auto grid aspect-square h-[40px] place-content-center font-bold text-red-500">
                  OUT
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
