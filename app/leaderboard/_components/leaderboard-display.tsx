'use client';

import { useState } from 'react';

import { Leaderboard } from '@/lib/pga-endpoints/pga-data.types';

const CutLine = () => (
  <div className="flex items-center gap-2 py-2">
    <div className="h-[2px] grow bg-red-300" />
    <div className="text-red-400">CUT LINE</div>
    <div className="h-[2px] grow bg-red-300" />
  </div>
);

type LeadboardPick = {
  user_id: string;
  golfer_id: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
  };
};

export default function LeaderboardDisplay({
  leaderboard,
  picks,
  user_id,
}: {
  leaderboard: Leaderboard['players'];
  picks: LeadboardPick[];
  user_id?: string;
}) {
  const [filter, setFilter] = useState('all');

  let filteredLeaderboard = leaderboard;
  if (filter === 'picked')
    filteredLeaderboard = leaderboard.filter(
      (row) =>
        row.player === undefined ||
        picks.some((pick) => pick.golfer_id === row.player?.id),
    );
  if (filter === 'mine')
    filteredLeaderboard = leaderboard.filter(
      (row) =>
        row.player === undefined ||
        picks.some(
          (pick) =>
            pick.golfer_id === row.player?.id && pick.user_id === user_id,
        ),
    );

  return (
    <>
      <div className="my-8 flex justify-center gap-8 text-gray-500">
        <label className="relative flex cursor-pointer select-none flex-col items-center justify-center gap-2">
          <input
            className="peer sr-only"
            type="radio"
            name="filters"
            onClick={() => setFilter('all')}
            defaultChecked
          />
          <span className="border-brand-blue text-lg peer-checked:border-b-2 peer-checked:text-xl peer-checked:text-brand-green">
            All
          </span>
        </label>
        <label className="relative flex cursor-pointer select-none flex-col items-center justify-center gap-2">
          <input
            className="peer sr-only"
            type="radio"
            name="filters"
            onClick={() => setFilter('picked')}
          />
          <span className="border-brand-blue text-lg peer-checked:border-b-2 peer-checked:text-xl peer-checked:text-brand-green">
            Picked
          </span>
        </label>
        <label className="relative flex cursor-pointer select-none flex-col items-center justify-center gap-2">
          <input
            className="peer sr-only"
            type="radio"
            name="filters"
            onClick={() => setFilter('mine')}
          />
          <span className="border-brand-blue text-lg peer-checked:border-b-2 peer-checked:text-xl peer-checked:text-brand-green">
            Mine
          </span>
        </label>
      </div>
      <div className="px-4">
        {filteredLeaderboard.map((row) =>
          row.player === undefined && row.scoringData === undefined ? (
            <CutLine key={'cutline'} />
          ) : (
            <div
              key={row.player?.id}
              className="flex border-b-2 border-b-gray-300 py-2"
            >
              <div className="w-10">{row.scoringData.position}</div>
              <div className="grow">
                <div>
                  {row.player.firstName} {row.player?.lastName}
                </div>
                <div className="ml-4 text-sm text-brand-blue">
                  {picks
                    ?.filter((pick) => pick.golfer_id === row.player.id)
                    .map(
                      (pick) =>
                        `${pick.profile.first_name} ${pick.profile.last_name}`,
                    )
                    .join(', ')}
                </div>
              </div>
              <div className="w-10">{row.scoringData.total}</div>
              <div className="w-12 text-right">
                {row.scoringData.thru === ''
                  ? row.scoringData.teeTime
                  : `${row.scoringData.score} (${row.scoringData?.thru})`}
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
}
