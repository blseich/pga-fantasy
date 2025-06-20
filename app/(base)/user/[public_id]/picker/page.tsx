import { CheckSquare } from 'lucide-react';

import GolferSelection from '@/features/golfer-selection';
import Headline from '@/components/headline';

export default async function PickerPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ bucket: string }>;
  params: Promise<{ public_id: string }>;
}) {
  const { bucket } = await searchParams;
  const { public_id } = await params;
  return (
    <>
      <Headline
        Icon={CheckSquare}
        title="Make Your Pick"
        subTitle={`Rank: ${bucket}`}
      />
      <GolferSelection bucket={bucket} public_id={public_id} />
    </>
  );
}
