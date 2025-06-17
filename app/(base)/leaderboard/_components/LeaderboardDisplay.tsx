'use client';

import { Leaderboard } from "@/lib/pga-endpoints/pgaData.types";
import { useState } from "react";

const CutLine = () => (
    <div className="flex gap-2 items-center py-2">
        <div className="grow h-[2px] bg-red-300" />
        <div className="text-red-400">CUT LINE</div>
        <div className="grow h-[2px] bg-red-300" />
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

export default function LeaderboardDisplay({ leaderboard, picks, user_id }: {leaderboard: Leaderboard["players"], picks: LeadboardPick[], user_id?: string }) {
    const [filter, setFilter] = useState('all');

    let filteredLeaderboard = leaderboard;
    if (filter === 'picked') filteredLeaderboard = leaderboard.filter((row) => row.player === undefined || picks.some((pick) => pick.golfer_id === row.player?.id));
    if (filter === 'mine') filteredLeaderboard = leaderboard.filter((row) => row.player === undefined || picks.some((pick) => pick.golfer_id === row.player?.id && pick.user_id === user_id));

    return (
        <>
            <div className="flex justify-center gap-8 my-8 text-gray-500">
                <label className="relative flex flex-col gap-2 justify-center items-center cursor-pointer select-none">
                    <input className="peer sr-only" type="radio" name="filters" onClick={() => setFilter('all')} defaultChecked />
                    <span className="text-lg peer-checked:text-brand-green peer-checked:border-b-2 border-brand-blue peer-checked:text-xl peer-checked:text-xl">All</span>
                </label>
                <label className="relative flex flex-col gap-2 justify-center items-center cursor-pointer select-none">
                    <input className="peer sr-only" type="radio" name="filters" onClick={() => setFilter('picked')} />
                    <span className="text-lg peer-checked:text-brand-green peer-checked:border-b-2 border-brand-blue peer-checked:text-xl">Picked</span>
                </label>
                <label className="relative flex flex-col gap-2 justify-center items-center cursor-pointer select-none">
                    <input className="peer sr-only" type="radio" name="filters" onClick={() => setFilter('mine')} />
                    <span className="text-lg peer-checked:text-brand-green peer-checked:border-b-2 border-brand-blue peer-checked:text-xl">Mine</span>
                </label>
            </div>
            <div className="px-4">
                {filteredLeaderboard.map((row) => (row.player === undefined && row.scoringData === undefined ? (<CutLine />) : (
                    <div key={row.player?.id} className="flex py-2 border-b-2 borde-b-gray-300">
                        <div className="w-10">{row.scoringData.position}</div>
                        <div className="grow">
                            <div>{row.player.firstName} {row.player?.lastName}</div>
                            <div className="ml-4 text-sm text-brand-blue">{picks?.filter((pick) => pick.golfer_id === row.player.id).map((pick) => `${pick.profile.first_name} ${pick.profile.last_name}`).join(', ')}</div>
                        </div>
                        <div className="w-10">{row.scoringData.total}</div>
                        <div className="w-12">{row.scoringData.score} ({row.scoringData?.thru})</div>
                    </div>
                )))}
            </div>
        </>
    )
}