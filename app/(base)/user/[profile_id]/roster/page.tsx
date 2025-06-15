import { getGolferRanks } from "@/lib/getGolferRanks";
import { Params } from "next/dist/server/request/params";
import { ArrowRightLeft } from "lucide-react";
import Image from "next/image";

export default async function RosterPage({ params }: { params: Params }) {
    return (
        <>
            <h1 className="text-2xl font-black my-8">Your Roster</h1>
            <div className="border-b-2 w-full mb-4 flex gap-2">
                <div className="relative h-32 w-32 flex flex-col justify-end overflow-hidden">
                    <Image className="absolute max-w-64 -z-10 -left-1/4" src="https://www.espn.com/i/headshots/golf/players/full/9478.png" width="185" height="295" alt="Scottie Scheffler" />
                    <div className="bottom-0 w-full bg-brand-blue text-black text-sm text-center">1-10</div>
                </div>
                <div className="grow">
                    <div className="mb-4">
                        <div>Scottie</div>
                        <div className="text-2xl -mt-2">Scheffler</div>
                    </div>
                    <div className="grid grid-cols-[auto_auto] grid-rows-[auto_auto] gap-x-2 text-xs">
                        <div>DG Rank:</div><div>1</div>
                        <div>WG Rank:</div><div>1</div>
                    </div>
                </div>
                <div className="pr-4">
                    <div>3:45 PM</div>
                    <button className="bg-yellow-300 text-black px-4 py-2 rounded-lg mt-8"><ArrowRightLeft/></button>
                </div>
            </div>
            <div className="border-b-2 w-full mb-4 flex gap-2">
                <div className="relative h-32 w-32 flex flex-col justify-end overflow-hidden shrink-0">
                    <Image className="absolute max-w-64 -z-10 -left-1/4" src="https://www.espn.com/i/headshots/golf/players/full/9243.png" width="185" height="295" alt="Scottie Scheffler" />
                    <div className="bottom-0 w-full bg-brand-blue text-black text-sm text-center">11-20</div>
                </div>
                <div className="shrink overflow-hidden">
                    <div className="mb-4">
                        <div>Christiaan</div>
                        <div className="text-2xl -mt-2 overflow-hidden text-ellipsis">Bezuidenhouttttt</div>
                    </div>
                    <div className="grid grid-cols-[auto_auto] grid-rows-[auto_auto] gap-x-2 text-xs">
                        <div>DG Rank:</div><div>1</div>
                        <div>WG Rank:</div><div>1</div>
                    </div>
                </div>
                <div className="pr-4 w-20 shrink-0">
                    <div>3:45 PM</div>
                    <button className="bg-yellow-300 text-black px-4 py-2 rounded-lg mt-8"><ArrowRightLeft/></button>
                </div>
            </div>
            
        </>
    );
}