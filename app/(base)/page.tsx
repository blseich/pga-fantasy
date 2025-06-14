import { createClient } from '@/utils/supabase/server';
import './home.css';
import Rankings from './_components/Rankings';

export default async function Home() {
  const supabase = await createClient();
  const { data: users } = await supabase.from('profiles').select('*');

  return (
    <div className="w-full max-w-screen-md p-4 flex flex-col gap-4 items-center">
      <Rankings users={users || []} />
    </div>
  );
}
