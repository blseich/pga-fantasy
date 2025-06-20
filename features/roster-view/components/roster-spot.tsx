import { type PickEntry } from '../types/pick-map';
import Selected from './selected';
import Unselected from './unselected';

export default async function RosterSpot({
  pick,
  bucket,
}: {
  pick: PickEntry;
  bucket: string;
}) {
  return (
    <div className="pick">
      {!pick ? <Unselected bucket={bucket} /> : <Selected pick={pick} />}
    </div>
  );
}
