'use client';

import { useCallback, useRef, useState } from 'react';

import { type UserWithPickDetails } from '@/types/db-fetched-types';

import GolferScore from './golfer-score';
import RankHeading from './rank-heading';
import Ranking from './ranking';
import RankingsControls from './rankings-controls';

export default function Rankings({
  rankings,
}: {
  rankings: UserWithPickDetails[];
}) {
  const [activeCards, setActiveCards] = useState<number[]>([]);
  const myRankRef = useRef<HTMLButtonElement>(null);

  const toggleCard = useCallback(
    (i: number) => {
      if (activeCards.includes(i)) {
        setActiveCards(activeCards.filter((index) => index !== i));
      } else {
        setActiveCards(activeCards.concat(i));
      }
    },
    [activeCards],
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {rankings.map((user, i) => (
        <Ranking
          key={user.public_id}
          buttonRef={user.me ? myRankRef : null}
          onClick={() => toggleCard(i)}
          rank={i}
          isOpen={activeCards.includes(i)}
        >
          <RankHeading {...user} rank={i + 1} />
          {user.picks.map((pick, i) => (
            <GolferScore
              {...pick}
              unscored={i === user.picks.length - 1}
              key={pick.id}
            />
          ))}
        </Ranking>
      ))}
      <RankingsControls
        totalRanks={rankings.length}
        myRankRef={myRankRef}
        callback={(newActives: number[]) => setActiveCards(newActives)}
      />
    </div>
  );
}
