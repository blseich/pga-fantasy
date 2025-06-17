import { ArrowRightLeft, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default  function SelectedGolfer({ golfer, rank_bucket, rank, swapLink, scoringData }) {
    return (
        <div className="border-b-2 w-full mb-4 flex gap-2 pb-2 items-center">
            <div className="relative h-[108px] w-[108px] flex flex-col justify-end overflow-hidden">
                <Image className="absolute max-w-[150%] -z-10 -left-1/4" src={`https://pga-tour-res.cloudinary.com/image/upload/headshots_${golfer.id}.png`} width="192" height="128" alt={`${golfer.firstName} ${golfer.lastName}`} />
                <div className="bottom-0 w-full bg-brand-blue text-black text-sm text-center">{rank_bucket}</div>
            </div>
            <div className="grow flex flex-col gap-x-2 gap-y-4">
                <div className="overflow-hidden">
                    <div className="text-sm">{golfer.firstName}</div>
                    <div className="text-2xl whitespace-nowrap text-ellipsis overflow-hidden">{golfer.lastName}</div>
                </div>
                <div className="grid grid-cols-[55px_auto] grid-rows-[auto_auto] gap-x-2 text-xs h-[40px] items-end">
                    <div>DG Rank:</div><div>{rank.dg_rank}</div>
                    <div>WG Rank:</div><div>{rank.owgr_rank}</div>
                </div>
            </div>
            <div className="w-[80px] h-full mr-2 text-center">
                {scoringData.score ? (<>
                    {scoringData.score === '-' ? <div className="text-sm text-red-400">CUT</div> : <div className="text-sm">{scoringData.score} ({scoringData.thru})</div> }
                    <div className="text-lg text-brand-green p-2">{scoringData.total}</div>
                </>) : (<>
                    <Link href={swapLink} className="bg-yellow-300 text-black px-4 rounded-lg mx-auto py-2 flex w-fit"><ArrowRightLeft className="inline"/></Link>
                </>)}
            </div>
        </div>
    );
}