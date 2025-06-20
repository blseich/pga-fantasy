'use client';

import { Home, Scale, TableProperties, User2, X } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { NavContext } from './nav-context';
import { usePathname } from 'next/navigation';

export default function NavDrawer() {
  const pathname = usePathname();
  const { open, closeNav, profileLink } = use(NavContext);

  return (
    <>
      <div
        className={`fixed top-0 z-20 h-screen w-11/12 border-r-8 border-r-brand-green bg-black text-white ${open ? 'left-0' : '-left-full'} transition-all duration-300 ease-in-out`}
      >
        <div className="flex w-full justify-end p-4">
          <button className="size-12 text-brand-green" onClick={closeNav}>
            <X className="size-full" />
          </button>
        </div>
        <div className="flex flex-col px-4">
          <Link
            className="flex w-full items-center gap-4 border-b-2 border-gray-500 py-4"
            href="/"
          >
            <span
              className={`p-4 ${pathname === '/' ? 'bg-brand-blue' : 'border-2 border-white'} rounded-full`}
            >
              <Home />
            </span>
            Home
          </Link>
          <Link
            className="flex w-full items-center gap-4 border-b-2 border-gray-500 py-4"
            href={profileLink}
          >
            <span
              className={`p-4 ${pathname === profileLink ? 'bg-brand-blue' : 'border-2 border-white'} rounded-full`}
            >
              <User2 />
            </span>
            Profile
          </Link>
          <Link
            className="flex w-full items-center gap-4 border-b-2 border-gray-500 py-4"
            href="/tiebreakers"
          >
            <span
              className={`p-4 ${pathname === '/tiebreakers' ? 'bg-brand-blue' : 'border-2 border-white'} rounded-full`}
            >
              <Scale />
            </span>
            Tiebreakers
          </Link>
          <Link
            className="flex w-full items-center gap-4 border-b-2 border-gray-500 py-4"
            href="/leaderboard"
          >
            <span
              className={`p-4  ${pathname === '/leaderboard' ? 'bg-brand-blue' : 'border-2 border-white'} rounded-full`}
            >
              <TableProperties />
            </span>
            Tournament Leaderboard
          </Link>
        </div>
      </div>
      <div
        role="presentation"
        aria-hidden="true"
        className={`fixed z-10 h-screen w-screen bg-black opacity-75 ${open ? 'block' : 'hidden'} left-0 top-0`}
        onClick={closeNav}
      />
    </>
  );
}
