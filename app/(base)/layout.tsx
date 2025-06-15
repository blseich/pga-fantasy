import { Geist } from "next/font/google";
import Link from "next/link";
import LogoSvg from './logo.svg';
import "../globals.css";
import { User2, SquareMenu } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const { data } = await supabase.from('profiles').select('public_id').eq('user_id', currentUser?.id);
  const profileId = data?.[0].public_id;

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
          <main className="min-h-screen">
              <nav className="w-full border-b border-b-foreground/10 py-2 px-4 flex items-center justify-center">
                <button className="mr-auto text-gray-500">
                  <SquareMenu className="h-10 w-10" />
                </button>
                <Link className="flex items-center gap-1" href="/">
                  <LogoSvg />
                  <div className="flex flex-col items-end">
                    <p className="font-black text-brand-green text-lg">PGA</p>
                    <p className="text-xs">Pick'Em</p>
                  </div>
                </Link>
                <Link className="ml-auto" href={`/user/${profileId}`}>
                  <User2 className="h-10 w-10 rounded-full border-[3px] border-gray-500 text-gray-500" />
                </Link>
              </nav>
              {children}
              <footer className="w-full flex items-center justify-center border-t py-2 px-4">
                <p>
                  Built by Seich
                </p>
              </footer>
          </main>
      </body>
    </html>
  );
}
