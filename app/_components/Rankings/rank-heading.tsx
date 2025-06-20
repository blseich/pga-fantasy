import { type UserWithPickDetails } from '@/app/page';

export default function RankHeading({
  first_name,
  last_name,
  rank,
  score,
}: UserWithPickDetails & { rank: number }) {
  return (
    <div className="flex w-full items-center gap-4">
      <div className="grid aspect-square w-8 place-items-center bg-brand-blue text-center font-bold text-black">
        {rank}
      </div>
      <div>
        {first_name} {last_name}
      </div>
      <div className="h-px grow bg-brand-blue" />
      <div className="text-brand-green">{score.displayValue}</div>
    </div>
  );
}
