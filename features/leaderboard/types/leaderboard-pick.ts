import { Tables } from '@/utils/supabase/database.types';

export type LeaderboardPick = Pick<Tables<'picks'>, 'user_id' | 'golfer_id'> & {
  profile: Pick<Tables<'profiles'>, 'first_name' | 'last_name'>;
};
