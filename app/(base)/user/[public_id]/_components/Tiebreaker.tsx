'use client';

import { useState } from "react";

const postPick = async (tiebreaker_score: number) => {
    const res = await fetch('/tiebreaker', {
        method: 'POST',
        body: JSON.stringify({ tiebreaker_score }),
    });
    const { success } = await res.json();
    return success;
}

function debounce(func: (...args: any[]) => any, delay: number) {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this as typeof debounce, args);
        }, delay);
    };
}

const debouncedPostPick = debounce(postPick, 500);

export default function Tiebreaker({ initScore, locked }: { initScore: number, locked: boolean }) {
    const [score, setScore] = useState(initScore);
    
    return (
        <div className="tiebreaker">
            <div className="text-center mb-4">Winning Score to Par:</div>
            <div className="flex gap-2 justify-center items-center">
                {!locked && (<button className="text-2xl font-bold text-brand-green w-12 aspect-square" onClick={() => {
                    debouncedPostPick(score - 1);
                    setScore(score - 1)
                }}>-</button>)}
                <div className="border-2 border-brand-blue grid place-items-center aspect-square w-12">{score === 0 ? 'E' : score > 0 ? `+${score}` : `${score}`}</div>
                {!locked && (<button className="text-2xl font-bold text-brand-green w-12 aspect-square" onClick={() => {
                    debouncedPostPick(score + 1);
                    setScore(score + 1)
                }}>+</button>)}
            </div>
        </div>
    )
}