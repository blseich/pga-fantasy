import { UserWithPickDetails } from "@/app/page";

export default function RankHeading({ first_name, last_name, rank, score }: UserWithPickDetails & { rank: number }){
    return (
        <div className="w-full flex items-center gap-4">
            <div className="w-8 bg-brand-blue text-center text-black font-bold aspect-square grid place-items-center">{rank}</div>
            <div>{first_name} {last_name}</div>
            <div className="h-[1px] grow bg-brand-blue"/>
            <div className="text-brand-green">{score.displayValue}</div>
        </div>
    );
} 