'use client';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useCallback, useState } from 'react';

import BallSVG from '../../../../../ball.svg';
import ClubSVG from '../../../../../club.svg';

const postPick = async (golfer_id: string, bucket: string, rank: string) => {
  const res = await fetch('/pick', {
    method: 'POST',
    body: JSON.stringify({ golfer_id, rank_bucket: bucket, dg_rank: rank }),
  });
  const { success } = await res.json();
  return success;
};

export const PickButton = ({
  golfer_id,
  bucket,
  rank,
  redirectHref,
}: {
  golfer_id: string;
  bucket: string;
  rank: string;
  redirectHref: string;
}) => {
  const [loading, setLoading] = useState(false);

  const pickChangeAction = useCallback(async () => {
    setLoading(true);
    const success = await postPick(golfer_id, bucket, rank);
    if (success) {
      redirect(redirectHref);
    }
  }, [golfer_id, bucket, rank, setLoading, redirectHref]);

  return (
    <>
      <button
        className="ml-auto grid aspect-square h-[40px] place-content-center rounded-full bg-brand-green text-black"
        onClick={pickChangeAction}
      >
        <Plus className="size-[30px]" />
      </button>
      {loading && (
        <div className="fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center bg-black/75">
          <div className="relative mx-auto mb-8 w-fit">
            <ClubSVG className="club h-fit w-48 fill-brand-blue" />
            <BallSVG className="ball absolute bottom-3 right-3 h-fit w-6 fill-white" />
          </div>
          <p className="text-center text-2xl">Loading...</p>
        </div>
      )}
    </>
  );
};
