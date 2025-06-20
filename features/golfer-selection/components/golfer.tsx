import { PropsWithChildren } from 'react';
import GolferImage from './golfer-image';
import { X } from 'lucide-react';

type GolferProps = PropsWithChildren<{
  firstName: string;
  lastName: string;
  id?: string;
  dg_rank: string;
  owgr_rank: string;
}>;

export default function Golfer({
  firstName,
  lastName,
  dg_rank,
  owgr_rank,
  id,
  children,
}: GolferProps) {
  return (
    <div className="mb-4 flex w-11/12 items-center gap-2 border-b-2 border-b-gray-500 px-2 pb-4">
      {id ? (
        <GolferImage firstName={firstName} lastName={lastName} id={id} />
      ) : (
        <X className="size-[75px]" />
      )}
      <div>
        <div className="font-bold">
          {firstName} {lastName}
        </div>
        <div className="grid grid-cols-[55px_auto] grid-rows-2">
          <div>DGR:</div>
          <div>{dg_rank}</div>
          <div>WGR:</div>
          <div>{owgr_rank}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
