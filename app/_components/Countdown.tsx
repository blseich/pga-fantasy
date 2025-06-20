'use client';

import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type CountdownClockProps = {
  targetDate: string | Date;
  pickLink: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = (target: Date): TimeLeft => {
  const total = target.getTime() - new Date().getTime();
  const seconds = Math.max(Math.floor(total / 1000), 0);

  return {
    days: Math.floor(seconds / (60 * 60 * 24)),
    hours: Math.floor((seconds % (60 * 60 * 24)) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
};

export default function Countdown({
  targetDate,
  pickLink,
}: CountdownClockProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(new Date(targetDate)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(new Date(targetDate)));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <>
      <div className="countdown mb-8 w-10/12 rounded-lg border-2 border-brand-blue px-2 py-4 text-center font-mono text-2xl">
        {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m :{' '}
        {timeLeft.seconds}s
      </div>
      <Link
        className="pick-link flex w-10/12 items-center justify-center gap-2 rounded-lg bg-brand-green p-4 text-black"
        href={pickLink}
      >
        Make Your Picks! <ArrowRightCircle className="inline" />
      </Link>
    </>
  );
}
