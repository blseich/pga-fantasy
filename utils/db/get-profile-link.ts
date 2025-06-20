import { createClient } from '@/utils/supabase/server';

export default async function getProfileLink() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('public_id')
    .eq('user_id', authUser?.id || '')
    .single();
  return `/user/${profile?.public_id}`;
}
