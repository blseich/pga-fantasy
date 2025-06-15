"use client";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { useCallback } from "react";

const postPick = async (golfer_id: string, bucket: string, rank: string) => {
    const res = await fetch('/pick', {
        method: 'POST',
        body: JSON.stringify({ golfer_id, rank_bucket: bucket, dg_rank: rank }),
    });
    const { success } = await res.json();
    return success;
}

export const PickButton = ({ golfer_id, bucket, rank, redirectHref}: { golfer_id: string, bucket: string, rank: string, redirectHref: string }) => {
    
    const pickChangeAction = useCallback(async () => {
        const success = await postPick(golfer_id, bucket, rank);
        if (success) {
            redirect(redirectHref);
        }
    }, [golfer_id, bucket, rank, redirect]);

    return (
        <button className="ml-auto bg-brand-green text-black aspect-square h-[40px] rounded-full grid place-content-center" onClick={pickChangeAction}>
            <Plus className="w-[30px] h-[30px]"/>
        </button>
    )
};