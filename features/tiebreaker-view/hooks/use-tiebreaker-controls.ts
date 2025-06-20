import { useCallback, useState } from 'react';
import postTiebreakerChange from '../api/post-tiebreaker-change';

export default function useTimebreakerControls(
  initScore?: number,
): [number | undefined, () => void, () => void] {
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

  return [score, decrementScore, incrementScore];
}
