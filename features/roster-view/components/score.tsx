import { type Leaderboard } from '@/lib/pga-endpoints/pga-data.types';

type ScoringData = Leaderboard['players'][0]['scoringData'];

const ScoreDisplay = ({ score, thru }: { score: string; thru: string }) => (
  <div className="text-sm">
    {score} ({thru})
  </div>
);

const TeeTimeDisplay = ({ teeTime }: { teeTime: string }) => (
  <div className="text-sm">{teeTime}</div>
);

const CutDisplay = () => <div className="text-sm text-red-400">CUT</div>;

export default function Score({ scoringData }: { scoringData: ScoringData }) {
  return (
    <>
      {{
        ACTIVE: (
          <ScoreDisplay score={scoringData.score} thru={scoringData.thru} />
        ),
        BETWEEN_ROUNDS: <TeeTimeDisplay teeTime={scoringData.teeTime || ''} />,
        CUT: <CutDisplay />,
      }[scoringData.playerState] || null}
      <div className="p-2 text-lg text-brand-green">{scoringData.total}</div>
    </>
  );
}
