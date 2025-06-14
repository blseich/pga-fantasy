'use client';

import { useState } from "react";
import Image from "next/image";

type User = {
    public_id: string | null,
    first_name: string | null,
    last_name: string | null,
}

export default function Rankings({ users }: { users: User[] }) {
    const [activeCard, setActiveCard] = useState(0);
    return users.map((user, i) => (
        <button
            key={user.public_id} style={{["--i" as any]: i}}
            className={`card border border-foreground/10 ${activeCard === i ? 'w-full p-4' : 'w-10/12 p-2'}`}
            onClick={() => setActiveCard(i)}
        >
            <div className="w-full flex items-center gap-4">
                <div>{user.first_name} {user.last_name}</div>
                <div className="h-[1px] grow bg-brand-blue"/>
                <div className="text-brand-green">-3</div>
            </div>
            <div className={`${activeCard === i ? 'max-h-60' : 'max-h-0'} transition-all duration-500 ease-out bg-black overflow-hidden`}>
                <div className="p-2 border-b-2 border-b-gray-500 w-full flex gap-2 items-center">
                    <Image src="https://www.espn.com/i/headshots/golf/players/full/9478.png" width="65" height="47" alt="Scottie Scheffler" />
                    <div className="text-left">
                        <div className="text-xs">Scottie</div>
                        <div className="">Scheffler</div>
                    </div>
                    <div className="ml-auto grid grid-rows-[auto_auto] grid-cols-[auto_auto] text-right gap-x-2">
                        <div className="text-xs">Today:</div>
                        <div className="text-xs">12:45</div>
                        <div className="">Overall:</div>
                        <div className="">-3</div>
                    </div>
                </div>
                <div className="p-2 border-b-2 border-b-gray-500 w-full flex gap-2 items-center">
                    <Image src="https://www.espn.com/i/headshots/golf/players/full/4404992.png" width="65" height="47" alt="Scottie Scheffler" />
                    <div className="text-left">
                        <div className="text-xs">Ben</div>
                        <div className="">Griffin</div>
                    </div>
                    <div className="ml-auto grid grid-rows-[auto_auto] grid-cols-[auto_auto] text-right gap-x-2">
                        <div className="text-xs">Today:</div>
                        <div className="text-xs">+3 (2)</div>
                        <div className="">Overall:</div>
                        <div className="">-3</div>
                    </div>
                </div>
                <div className="h-12 border-b-2 border-b-gray-500 w-full"/>
                <div className="h-12 border-b-2 border-b-gray-500 w-full"/>
            </div>
        </button>
    ));
} 