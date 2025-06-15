"use client";
import { Plus } from "lucide-react";

const postPick = async (golfer_id: string, bucket: string) => {
    await fetch('/pick', {
        method: 'POST',
        body: JSON.stringify({ golfer_id, rank_bucket: bucket }),
    });
}

export const PickButton = ({ golfer_id, bucket}: { golfer_id: string, bucket: string }) => (
    <button className="ml-auto bg-brand-green text-black aspect-square h-[40px] rounded-full grid place-content-center" onClick={() => postPick(golfer_id, bucket)}>
        <Plus className="w-[30px] h-[30px]"/>
    </button>
);