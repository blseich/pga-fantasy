"use client";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { useCallback, useState } from "react";
import ClubSVG from '../../../../../club.svg';
import BallSVG from '../../../../../ball.svg';

const postPick = async (golfer_id: string, bucket: string, rank: string) => {
    const res = await fetch('/pick', {
        method: 'POST',
        body: JSON.stringify({ golfer_id, rank_bucket: bucket, dg_rank: rank }),
    });
    const { success } = await res.json();
    return success;
}

export const PickButton = ({ golfer_id, bucket, rank, redirectHref}: { golfer_id: string, bucket: string, rank: string, redirectHref: string }) => {
    const [loading, setLoading] = useState(false);
    
    const pickChangeAction = useCallback(async () => {
        setLoading(true);
        const success = await postPick(golfer_id, bucket, rank);
        if (success) {
            redirect(redirectHref);
        }
    }, [golfer_id, bucket, rank, redirect, setLoading]);

    return (
        <>
            <button className="ml-auto bg-brand-green text-black aspect-square h-[40px] rounded-full grid place-content-center" onClick={pickChangeAction}>
                <Plus className="w-[30px] h-[30px]"/>
            </button>
            {loading && (<div className="fixed h-screen w-screen top-0 left-0 bg-black bg-opacity-75 grid place-items-center z-50">
                <div className="relative w-fit mx-auto mb-8">
                    <ClubSVG className="club fill-brand-blue w-48 h-fit"/>
                    <BallSVG className="ball fill-white w-6 h-fit absolute right-3 bottom-3"/>
                </div>
                <p className="text-2xl text-center">Loading...</p>
            </div>)}
        </>
    )
};