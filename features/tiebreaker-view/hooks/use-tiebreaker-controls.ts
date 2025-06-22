import { useCallback, useState } from 'react';
import postTiebreakerChange from '../api/post-tiebreaker-change';

type TiebreakerControls = {
  score: number | undefined;
  decrementScore: () => void;
  incrementScore: () => void;
};

export default function useTimebreakerControls(
  initScore?: number,
): TiebreakerControls {
  const [score, setScore] = useState(initScore);

  const decrementScore = useCallback(() => {
    const newScore = score === undefined ? 0 : score - 1;
    postTiebreakerChange(newScore);
    setScore(newScore);
  }, [score, setScore]);

  const incrementScore = useCallback(() => {
    const newScore = score === undefined ? 0 : score + 1;
    postTiebreakerChange(newScore);
    setScore(newScore);
  }, [score, setScore]);

  return { score, decrementScore, incrementScore };
}
