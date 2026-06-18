'use client';

import ClientErrorPopup from '@/components/client-error-popup';
import TiebreakerDisplay from './tiebreaker-display';
import useTiebreakerControls from '../hooks/use-tiebreaker-controls';
import TieBreakerControl from './tiebreaker-control';

export default function TiebreakerEditor({
  initScore,
}: {
  initScore?: number;
}) {
  const { score, incrementScore, decrementScore, errorMessage } =
    useTiebreakerControls(initScore);

  return (
    <>
      <TieBreakerControl callback={decrementScore}>-</TieBreakerControl>
      <TiebreakerDisplay score={score} />
      <TieBreakerControl callback={incrementScore}>+</TieBreakerControl>
      {errorMessage && <ClientErrorPopup message={errorMessage} />}
    </>
  );
}
