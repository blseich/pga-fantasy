import { Geist } from 'next/font/google';
import './globals.css';

import { signOutAction } from './actions';
import { Nav, HomeIconLink, ProfileIconLink } from '@/features/navigation';

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
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="min-h-screen">
          <nav className="w-full border-b border-b-foreground/10">
            <div className="mx-auto  flex max-w-screen-md items-center justify-center px-4 py-2">
              <Nav />
              <HomeIconLink />
              <ProfileIconLink />
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
