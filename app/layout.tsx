import { User2 } from 'lucide-react';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

import { createClient } from '@/utils/supabase/server';

import OffCanvasNav from './_components/off-canvas-nav';
import { signOutAction } from './actions';
import LogoSvg from './logo.svg';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default async function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from('profiles')
    .select('public_id')
    .eq('user_id', currentUser?.id || '');
  const profileId = data?.[0].public_id;

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="min-h-screen">
          <nav className="w-full border-b border-b-foreground/10">
            <div className="mx-auto  flex max-w-screen-md items-center justify-center px-4 py-2">
              <OffCanvasNav profileLink={`/user/${profileId}`} />
              <Link className="flex items-center gap-1" href="/">
                <LogoSvg />
                <div className="flex flex-col items-end">
                  <p className="text-lg font-black text-brand-green">PGA</p>
                  <p className="text-xs">Pick&apos;Em</p>
                </div>
              </Link>
              <Link className="ml-auto" href={`/user/${profileId}`}>
                <User2 className="size-10 rounded-full border-[3px] border-gray-500 text-gray-500" />
              </Link>
            </div>
          </nav>
          <div className="mx-auto max-w-screen-md">{children}</div>
        </main>
        <footer className="flex w-full items-center justify-between border-t px-4 py-2">
          <p>
            Built by <span className="text-brand-blue">Seich</span>
          </p>
          <button className="underline" onClick={signOutAction}>
            Sign Out
          </button>
        </footer>
      </body>
    </html>
  );
}
