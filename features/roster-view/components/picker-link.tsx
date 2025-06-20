import getProfileLink from '@/utils/db/get-profile-link';
import { ArrowRightLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function PickerLink({
  swap,
  bucket,
}: {
  swap?: boolean;
  bucket: string;
}) {
  return (
    <Link
      href={`${await getProfileLink()}/pick?bucket=${bucket}`}
      className="mx-auto rounded-lg bg-brand-green px-4 py-2 text-black"
    >
      {swap ? <ArrowRightLeft className="inline" /> : <Plus />}
    </Link>
  );
}
