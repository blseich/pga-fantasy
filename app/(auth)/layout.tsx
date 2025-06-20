import { Geist } from 'next/font/google';
import '../globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PGA Pick'Em",
  description: 'Pick Golfers. Watch Golf. Lose Money to Friends.',
};

const geist = Geist({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
