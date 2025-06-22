'use client';

import TiebreakerDisplay from './tiebreaker-display';
import useTiebreakerControls from '../hooks/use-tiebreaker-controls';
import TieBreakerControl from './tiebreaker-control';

export default function TiebreakerEditor({
  initScore,
}: {
  initScore?: number;
}) {
  const { score, incrementScore, decrementScore } =
    useTiebreakerControls(initScore);

  return (
    <>
      <TieBreakerControl callback={decrementScore}>-</TieBreakerControl>
      <TiebreakerDisplay score={score} />
      <TieBreakerControl callback={incrementScore}>+</TieBreakerControl>
    </>
  );
}
