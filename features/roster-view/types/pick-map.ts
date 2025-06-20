import { Tables } from '@/utils/supabase/database.types';

export type PickEntry = Tables<'picks'> & {
  dg_rank: string;
  owgr_rank: string;
};

export type PickMap = {
  [key: string]: PickEntry;
};
