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

export default function Countdown({ targetDate, pickLink }: CountdownClockProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(new Date(targetDate)));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(new Date(targetDate)));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <>
        <div className="countdown py-4 px-2 border-2 border-brand-blue rounded-lg text-2xl w-10/12 text-center font-mono mb-8">
          {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
        </div>
        <Link className="pick-link bg-brand-green p-4 w-10/12 rounded-lg text-black flex gap-2 items-center justify-center" href={pickLink}>Make Your Picks! <ArrowRightCircle className="inline"/></Link> 
    </>
  );
};
