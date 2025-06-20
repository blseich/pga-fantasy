'use client';

import { User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function GolferImage({
  id,
  firstName,
  lastName,
}: {
  id: string;
  firstName: string;
  lastName: string;
}) {
  const [error, setError] = useState(false);
  return (
    <div className="flex aspect-square w-[75px] flex-col items-center justify-end overflow-hidden rounded-full bg-brand-blue">
      {error ? (
        <User />
      ) : (
        <Image
          className="w-[150%] max-w-[150%]"
          onError={() => setError(true)}
          src={`https://pga-tour-res.cloudinary.com/image/upload/headshots_${id}.png`}
          alt={`${firstName} ${lastName}`}
          width={185}
          height={134}
        />
      )}
    </div>
  );
}
