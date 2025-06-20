import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

import getProfileLink from '../utils/get-user-public-id';

export default async function Countdown() {
  return (
    <>
      <Link
        className="pick-link flex w-10/12 items-center justify-center gap-2 rounded-lg bg-brand-green p-4 text-black"
        href={await getProfileLink()}
      >
        Make Your Picks! <ArrowRightCircle className="inline" />
      </Link>
    </>
  );
}
