import { Geist } from 'next/font/google';
import '../globals.css';

import { signOutAction } from './actions';
import { Nav, HomeIconLink, ProfileIconLink } from '@/features/navigation';
import { Metadata } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PGA Pick'Em",
  description: 'Pick Golfers. Watch Golf. Lose Money to Friends.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
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
