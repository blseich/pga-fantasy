import { UserCircle2 } from 'lucide-react';

import { createClient } from '@/utils/supabase/server';

import './user.css';
import Headline from '@/components/headline';
import RosterView from '@/features/roster-view';
import TiebreakerView from '@/features/tiebreaker-view';

export default async function UserPage({
  params,
}: {
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('first_name, last_name, public_id')
    .eq('public_id', public_id as string);
  const user = data?.[0];

  return (
    <>
      <Headline
        title={`${user?.first_name} ${user?.last_name}`}
        Icon={UserCircle2}
      />
      <TiebreakerView public_id={public_id} />
      <RosterView public_id={public_id} />
    </>
  );
}
