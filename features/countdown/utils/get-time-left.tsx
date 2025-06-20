import { type TimeLeft } from '../types/time-left';

export default function TimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - new Date().getTime();
  const seconds = Math.max(Math.floor(total / 1000), 0);

  return {
    days: Math.floor(seconds / (60 * 60 * 24)),
    hours: Math.floor((seconds % (60 * 60 * 24)) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}
