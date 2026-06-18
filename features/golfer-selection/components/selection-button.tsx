'use client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import BallSVG from '@/ball.svg';
import ClubSVG from '@/club.svg';
import ClientErrorPopup from '@/components/client-error-popup';
import { parseMutationResponse } from '@/utils/api/mutation-response';

const postPick = async (golfer_id: string, bucket: string, rank: string) => {
  try {
    const res = await fetch('/pick', {
      method: 'POST',
      body: JSON.stringify({ golfer_id, rank_bucket: bucket, dg_rank: rank }),
    });
    return parseMutationResponse(res);
  } catch {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to reach the server. Please try again.',
      },
    };
  }
};

export default function SelectionButton({
  golfer_id,
  bucket,
  rank,
  redirectHref,
}: {
  golfer_id: string;
  bucket: string;
  rank: string;
  redirectHref: string;
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const pickChangeAction = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);

    const result = await postPick(golfer_id, bucket, rank);

    if (result.success) {
      router.push(redirectHref);
      return;
    }

    setErrorMessage(
      result.error?.message || 'Unable to save your pick right now.',
    );
    setLoading(false);
  }, [golfer_id, bucket, rank, loading, router, redirectHref]);

  return (
    <>
      <button
        aria-label="Select golfer"
        className="ml-auto grid aspect-square h-[40px] place-content-center rounded-full bg-brand-green text-black"
        disabled={loading}
        onClick={pickChangeAction}
      >
        <Plus className="size-[30px]" />
      </button>
      {errorMessage && <ClientErrorPopup message={errorMessage} />}
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
}
