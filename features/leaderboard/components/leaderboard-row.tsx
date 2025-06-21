import { Leaderboard } from '@/lib/pga-endpoints/pga-data.types';

export default function LeaderboardRow({
  row,
  pickers,
}: {
  row: Leaderboard['players'][0];
  pickers: string;
}) {
  return (
    <div
      key={row.player?.id}
      className="flex border-b-2 border-b-gray-300 py-2"
    >
      <div className="w-10">{row.scoringData.position}</div>
      <div className="grow">
        <div>
          {row.player.firstName} {row.player?.lastName}
        </div>
        <div className="ml-4 text-sm text-brand-blue">{pickers}</div>
      </div>
      <div className="w-10">{row.scoringData.total}</div>
      <div className="w-12 text-right">
        {row.scoringData.thru === ''
          ? row.scoringData.teeTime
          : `${row.scoringData.score} (${row.scoringData?.thru})`}
      </div>
    </div>
  );
}
