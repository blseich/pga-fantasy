import { ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default  function SelectedGolfer({ golfer, rank_bucket, rank, score, swapLink }) {
    const [first, ...last] = golfer.displayName.split(' ');
    return (
        <div className="border-b-2 w-full mb-4 flex gap-2 pb-2 items-end">
            <div className="relative h-[108px] w-[108px] flex flex-col justify-end overflow-hidden">
                <Image className="absolute max-w-48 -z-10 -left-1/4" src={golfer.headshot.href} width="162" height="295" alt="Scottie Scheffler" />
                <div className="bottom-0 w-full bg-brand-blue text-black text-sm text-center">{rank_bucket}</div>
            </div>
            <div className="grow grid grid-cols-[auto_85px] grid-rows-[auto_40px] gap-x-2 gap-y-4 pr-2">
                <div className="overflow-hidden">
                    <div className="text-sm">{first}</div>
                    <div className="text-2xl whitespace-nowrap text-ellipsis overflow-hidden">{last.join(' ')}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm">{score.today}</div>
                    <div className="text-lg text-brand-green">{score.overall}</div>
                </div>
                <div className="grid grid-cols-[55px_auto] grid-rows-[auto_auto] gap-x-2 text-xs h-[40px] items-end">
                    <div>DG Rank:</div><div>{rank.dg_rank}</div>
                    <div>WG Rank:</div><div>{rank.owgr_rank}</div>
                </div>
                <Link href={swapLink} className="bg-yellow-300 text-black px-4 py-2 rounded-lg mx-auto"><ArrowRightLeft/></Link>
            </div>
        </div>
    );
}