import { getTournament } from '@/lib/pga-endpoints/get-pga-endpoints';
import getCurrentTiebreakerValue from '../utils/get-current-tiebreaker-value';
import TiebreakerDisplay from './tiebreaker-display';
import TiebreakerEditor from './tiebreaker-editor';

export default async function TiebreakerView({
  public_id,
}: {
  public_id: string;
}) {
  const tiebreakerScore = await getCurrentTiebreakerValue(public_id);
  const tournament = await getTournament();
  console.log(tournament.tournamentStatus);
  return (
    <>
      <h1 className="mb-4 mt-8 text-center text-2xl font-black">Tiebreaker</h1>
      <div className="tiebreaker">
        <div className="mb-4 text-center">Winning Score to Par:</div>
        <div className="flex items-center justify-center gap-2">
          {tournament.tournamentStatus === 'NOT_STARTED' ? (
            <TiebreakerEditor initScore={tiebreakerScore} />
          ) : (
            <TiebreakerDisplay score={tiebreakerScore} />
          )}
        </div>
      </div>
    </>
  );
}
