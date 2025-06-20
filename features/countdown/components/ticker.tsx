'use client';

import { useEffect, useState } from 'react';

import { type TimeLeft } from '../types/time-left';
import getTimeLeft from '../utils/get-time-left';

type TickerProps = {
  targetDate: Date;
};

export default function Ticker({ targetDate }: TickerProps) {
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
    <div className="countdown mb-8 w-10/12 rounded-lg border-2 border-brand-blue px-2 py-4 text-center font-mono text-2xl">
      {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m :{' '}
      {timeLeft.seconds}s
    </div>
  );
}
