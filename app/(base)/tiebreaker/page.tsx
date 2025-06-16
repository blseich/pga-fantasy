import getLeadingScore from "@/lib/getLeadingScore";
import { createClient } from "@/utils/supabase/server";
import { Scale } from "lucide-react";
import { Fragment } from "react";

export default async function TiebreakerPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('profiles').select('first_name,last_name,tiebreakers:tiebreakers (tiebreaker_score) ');
    const leadingScore = await getLeadingScore();

    return (
        <>
            <div className="flex flex-col items-center justify-center mx-auto my-8 gap-2">
                <Scale className="h-[36px] w-[36px] text-brand-green"/>
                <h1 className="text-4xl font-bold">Tiebreaker</h1>
                <h2 className="text-brand-blue">Current Leading Score: {leadingScore}</h2>
            </div>
            <div className="grid grid-cols-[1fr_80px] w-10/12 mx-auto">
                {data?.sort((userA, userB) => Math.abs(userA.tiebreakers?.tiebreaker_score || 0 - leadingScore) - Math.abs(userB.tiebreakers?.tiebreaker_score || 0 - leadingScore))
                    .map(({ first_name, last_name, tiebreakers }) => (
                        <Fragment key={`${first_name}_${last_name}`}>
                            <div className="p-4">{first_name} {last_name}</div>
                            <div className="p-4">{tiebreakers?.tiebreaker_score}</div>
                            <div className="h-[2px] bg-gray-500 col-span-2 mx-2"/>
                        </Fragment>
                    ))}
            </div>
        </>
    )
}