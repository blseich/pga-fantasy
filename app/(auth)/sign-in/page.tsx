import Link from 'next/link';

import { signInAction } from '@/app/actions';

import GolfBallSvg from './53678130-golf-ball-on-tee.svg';

export default async function LoginPage() {
  return (
    <div className="relative w-full max-w-screen-sm p-8">
      <GolfBallSvg
        className="mx-auto mt-8 h-auto w-5/6 [&>path]:w-full"
        viewBox="0 0 185 295"
        alt="PGA Pick'Em"
      />
      <form className="-mt-32 flex flex-col items-center justify-center gap-4">
        <input
          type="email"
          name="email"
          className="w-full border-2 border-solid border-brand-blue bg-background/75 p-2 text-foreground"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          className="w-full border-2 border-solid border-brand-blue bg-background/75 p-2 text-foreground"
          placeholder="Password"
          required
        />
        <br />
        <button
          className="w-full rounded-lg bg-brand-green p-2 text-black"
          formAction={signInAction}
        >
          Sign In
        </button>
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign Up
        </Link>
        <Link
          href="/forgot-password"
          className="text-sm text-brand-blue underline underline-offset-4"
        >
          Forgot Password
        </Link>
      </form>
    </div>
  );
}
