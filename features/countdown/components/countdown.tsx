import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

import getProfileLink from '@/utils/db/get-profile-link';
import Ticker from './ticker';
import getTargetDate from '../utils/target-date';

export default async function Countdown() {
  return (
    <div className="grid place-items-center">
      <Ticker targetDate={await getTargetDate()} />
      <Link
        className="pick-link flex w-10/12 items-center justify-center gap-2 rounded-lg bg-brand-green p-4 text-black"
        href={await getProfileLink()}
      >
        Make Your Picks! <ArrowRightCircle className="inline" />
      </Link>
    </div>
  );
}
