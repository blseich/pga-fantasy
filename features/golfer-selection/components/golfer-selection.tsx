import getProfileLink from '@/utils/db/get-profile-link';
import getCurrentSelection from '../utils/get-current-selection';
import getGolferSelections from '../utils/get-golfer-selections';
import SelectableGolfer from './selectable-golfer';
import SelectedGolfer from './selected-golfer';
import SelectionButton from './selection-button';
import UnselectableGolfer from './unselectable-golfer';

export default async function GolferSelection({
  bucket,
  public_id,
}: {
  bucket: string;
  public_id: string;
}) {
  const golferSelections = await getGolferSelections(bucket);
  const currentSelection = await getCurrentSelection(bucket, public_id);
  const profileLink = await getProfileLink();
  return (
    <div className="flex flex-col items-center">
      {golferSelections.map((golferSelection) =>
        'id' in golferSelection && golferSelection.id === currentSelection ? (
          <SelectedGolfer golfer={golferSelection} key={golferSelection.id} />
        ) : 'id' in golferSelection ? (
          <SelectableGolfer golfer={golferSelection} key={golferSelection.id}>
            <SelectionButton
              golfer_id={golferSelection.id}
              bucket={bucket}
              rank={golferSelection.rank.dg_rank}
              redirectHref={profileLink}
            />
          </SelectableGolfer>
        ) : (
          <UnselectableGolfer
            golfer={golferSelection}
            key={golferSelection.dg_rank}
          />
        ),
      )}
    </div>
  );
}
