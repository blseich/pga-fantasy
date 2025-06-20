import getProfileLink from '@/utils/db/get-profile-link';
import { User2 } from 'lucide-react';
import Link from 'next/link';

export default async function ProfileIconLink() {
  return (
    <Link className="ml-auto" href={await getProfileLink()}>
      <User2 className="size-10 rounded-full border-[3px] border-gray-500 text-gray-500" />
    </Link>
  );
}
