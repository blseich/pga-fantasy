'use client';

import { SquareMenu } from 'lucide-react';
import { NavContext } from './nav-context';
import { use } from 'react';

export default function NavToggle() {
  const { openNav } = use(NavContext);

  return (
    <button className="mr-auto text-gray-500" onClick={openNav}>
      <SquareMenu className="size-10" />
    </button>
  );
}
