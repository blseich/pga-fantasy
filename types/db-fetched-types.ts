import { Tables } from '@/utils/supabase/database.types';

type PickWithDetails = Tables<'picks'> & {
  golfer: {
    first_name: string;
    last_name: string;
    headshot: string;
  };
  score: {
    today: string;
    overall: {
      value: number;
      displayValue: string;
    };
  };
};
export type UserWithPickDetails = Pick<
  Tables<'profiles'>,
  'first_name' | 'last_name' | 'public_id'
> & {
  picks: PickWithDetails[];
  score: {
    value: number;
    displayValue: string;
  };
  me: boolean;
};
