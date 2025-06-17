'use client';

import { Home, Scale, SquareMenu, TableProperties, User2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Nav = ({ profileLink, open, onClose }: { profileLink: string, open: boolean, onClose: () => void }) => {
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname]);

    return (
        <>
            <div className={`fixed h-screen w-11/12 bg-black border-r-8 border-r-brand-green top-0 z-20 text-white ${open ? 'left-0' : '-left-full'} transition-all duration-300 ease-in-out`}>
                <div className="flex w-full justify-end p-4">
                    <button className="text-brand-green h-12 w-12" onClick={onClose}><X className="h-full w-full"/></button>
                </div>
                <div className="flex flex-col px-4">
                    <Link className="w-full border-b-2 border-gray-500 py-4 flex gap-4 items-center" href="/">
                        <span className={`p-4 ${pathname === '/' ? 'bg-brand-blue' : 'border-2 border-white' } rounded-full`}><Home /></span>
                        Home
                    </Link>
                    <Link className="w-full border-b-2 border-gray-500 py-4 flex gap-4 items-center" href={profileLink}>
                        <span className={`p-4 ${pathname === profileLink ? 'bg-brand-blue' : 'border-2 border-white' } rounded-full`}><User2 /></span>
                        Profile
                    </Link>
                    <Link className="w-full border-b-2 border-gray-500 py-4 flex gap-4 items-center" href="/tiebreakers">
                        <span className={`p-4 ${pathname === '/tiebreakers' ? 'bg-brand-blue' : 'border-2 border-white' } rounded-full`}><Scale /></span>
                        Tiebreakers
                    </Link>
                    <Link className="w-full border-b-2 border-gray-500 py-4 flex gap-4 items-center" href="/leaderboard">
                        <span className={`p-4  ${pathname === '/leaderboard' ? 'bg-brand-blue' : 'border-2 border-white' } rounded-full`}><TableProperties /></span>
                        Tournament Leaderboard
                    </Link>
                </div>
            </div>
            <div className={`fixed h-screen w-screen z-10 bg-black opacity-75 ${open ? 'block' : 'hidden'} top-0 left-0`} onClick={onClose}/>
        </>
    )
};

export default function OffCanvasNav({ profileLink }: { profileLink: string }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <button className="mr-auto text-gray-500" onClick={() => setOpen(true)}>
                <SquareMenu className="h-10 w-10" />
            </button>
            <Nav profileLink={profileLink} open={open} onClose={() => setOpen(false)} />
        </>
    )
};