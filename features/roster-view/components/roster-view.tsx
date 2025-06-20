import getUserPicks from '../utils/get-user-picks';
import RosterSpot from './roster-spot';
import '../styles/roster.css';

export default async function RosterView({ public_id }: { public_id: string }) {
  const pickMap = await getUserPicks(public_id);
  return (
    <>
      <h2 className="mb-4 mt-8 text-center text-2xl font-black">Roster</h2>
      <div className="roster">
        <RosterSpot pick={pickMap['1-10']} bucket="1-10" />
        <RosterSpot pick={pickMap['11-20']} bucket="11-20" />
        <RosterSpot pick={pickMap['21-40']} bucket="21-40" />
        <RosterSpot pick={pickMap['41+']} bucket="41+" />
      </div>
    </>
  );
}
