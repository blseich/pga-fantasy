'use client';

import { useCallback, useState } from "react";
import Image from "next/image";
import { UserWithPickDetails } from '../page';


const RankHeading = ({ first_name, last_name, rank, score }: UserWithPickDetails & { rank: number }) => (
    <div className="w-full flex items-center gap-4">
        <div className="w-8 bg-brand-blue text-center text-black font-bold aspect-square grid place-items-center">{rank}</div>
        <div>{first_name} {last_name}</div>
        <div className="h-[1px] grow bg-brand-blue"/>
        <div className="text-brand-green">{score.displayValue}</div>
    </div>
);

const GolferScore = ({ golfer, score, unscored }: UserWithPickDetails['picks'][0] & { unscored?: boolean }) => (
    <div className={`p-2 w-full flex gap-2 items-center relative ${unscored ? 'opacity-50' : 'border-b-2 border-b-gray-500'}`}>
        <Image src={golfer.headshot} width="65" height="47" alt="Scottie Scheffler" />
        <div className="text-left">
            <div className="text-xs">{golfer.first_name}</div>
            <div className="">{golfer.last_name}</div>
        </div>
        <div className="ml-auto grid grid-rows-[auto_auto] grid-cols-[auto_auto] text-right gap-x-2">
            <div className="text-xs">Today:</div>
            <div className="text-xs">{score.today}</div>
            <div className="">Overall:</div>
            <div className="">{score.overall.displayValue}</div>
        </div>
    </div>
);

export default function Rankings({ users }: { users: UserWithPickDetails[] }) {
    const [activeCards, setActiveCards] = useState<number[]>([]);

    const toggleCard = useCallback((i: number) => {
        if (activeCards.includes(i)) {
            setActiveCards(activeCards.filter((index) => index !== i));
        } else {
            setActiveCards(activeCards.concat(i));
        }
    }, [activeCards]);

    return users.map((user, i) => (
        // <Rank user_id={user.user_id} />
        <button
            key={user.public_id} style={{["--i" as any]: i}}
            className={`card  border border-foreground/10 ${activeCards.includes(i) ? 'w-full p-4' : 'w-10/12 p-2'}`}
            onClick={() => toggleCard(i)}
        >
            <RankHeading {...user} rank={i+1} />
            <div className={`${activeCards.includes(i) ? 'max-h-80' : 'max-h-0'} transition-all duration-500 ease-out bg-black overflow-hidden`}>
                {user.picks.map((pick, i) => (
                    <GolferScore {...pick} unscored={i === user.picks.length - 1}/>
                ))}
            </div>
        </button>
    ));
} 