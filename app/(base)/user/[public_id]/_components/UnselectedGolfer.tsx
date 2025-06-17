import { Plus, User2 } from "lucide-react";
import Link from "next/link";

export default function UnselectedGolfer({ rank_bucket, swapLink }: { rank_bucket: string, swapLink: string }) {
    return (
        <div className="border-b-2 w-full mb-4 flex gap-2 pb-2 items-end">
            <div className="relative h-[108px] w-[108px] flex flex-col justify-end overflow-hidden">
                <User2 className="absolute w-[108px] h-[108px] -z-10 top-0 left-0"/>
                <div className="bottom-0 w-full bg-brand-blue text-black text-sm text-center">{rank_bucket}</div>
            </div>
            <div className="grow grid grid-cols-[auto_85px] grid-rows-[52px_40px] gap-x-2 gap-y-4 pr-2">
                <div className="row-span-2 flex flex-col justify-center">
                    <div className="text-sm">Make a</div>
                    <div className="text-2xl">Selection</div>
                </div>
                <div className="row-span-2 flex items-center">
                    <Link href={swapLink} className="bg-brand-green text-black px-4 py-2 rounded-lg mx-auto">
                        <Plus />
                    </Link>
                </div>
            </div>
        </div>
    );
}