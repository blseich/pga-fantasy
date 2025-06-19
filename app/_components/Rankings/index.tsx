'use client';

import { useCallback, useRef, useState } from "react";
import { CopyMinus, CopyPlus, Crosshair, Trophy } from "lucide-react";
import { UserWithPickDetails } from "@/app/page";
import RankHeading from "./RankHeading";
import GolferScore from "./GolferScore";

export default function Rankings({ users }: { users: UserWithPickDetails[] }) {
    const [activeCards, setActiveCards] = useState<number[]>([]);
    const refsArray = Array.from({ length: users.length }, () => useRef<HTMLButtonElement>(null));

    const toggleCard = useCallback((i: number) => {
        if (activeCards.includes(i)) {
            setActiveCards(activeCards.filter((index) => index !== i));
        } else {
            setActiveCards(activeCards.concat(i));
        }
    }, [activeCards]);

    const expandAll = useCallback(() => {
        const allIndexes = Array.from({ length: users.length }, (_, index) => index);
        setActiveCards(allIndexes);
    }, [users, setActiveCards]);

    const collapseAll = useCallback(() => {
        setActiveCards([]);
    }, [setActiveCards]);

    const findMe = useCallback(() => {
        const meIndex = users.findIndex((user) => user.me);
        refsArray[meIndex].current?.scrollIntoView({
            behavior: 'smooth',
        });
        refsArray[meIndex].current?.classList.add('highlighted')
        setTimeout(() => refsArray[meIndex].current?.classList.remove('highlighted'), 2000);
    }, [refsArray, users]);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {users.map((user, i) => (
                <button
                    key={user.public_id} style={{["--i" as any]: i}}
                    className={`card border border-foreground/10 ${activeCards.includes(i) ? 'w-full p-4' : 'w-10/12 p-2'}`}
                    onClick={() => toggleCard(i)}
                    ref={refsArray[i]}
                >
                    <RankHeading {...user} rank={i+1} />
                    <div className={`${activeCards.includes(i) ? 'max-h-80' : 'max-h-0'} transition-all duration-500 ease-out bg-black overflow-hidden`}>
                        {user.picks.map((pick, i) => (
                            <GolferScore {...pick} unscored={i === user.picks.length - 1}/>
                        ))}
                    </div>
                </button>
            ))}
            <div className="w-full bg-black border-b-2 border-gray-500 sticky bottom-0 z-10">
                <div className="flex items-center justify-center gap-16 py-4">
                    <button className="flex flex-col items-center" onClick={expandAll}><CopyPlus /></button>
                    <button className="flex flex-col items-center" onClick={collapseAll}><CopyMinus /></button>
                    <button className="flex flex-col items-center" onClick={findMe}><Crosshair/></button>
                </div>
            </div>
        </div>
    );
} 