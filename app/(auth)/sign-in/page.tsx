import Link from 'next/link';
import GolfBallSvg from './53678130-golf-ball-on-tee.svg';
import { signInAction } from '@/app/actions';

export default async function LoginPage() {
    return (
        <div className="relative w-full p-8 max-w-screen-sm">
            <GolfBallSvg className="w-5/6 h-auto [&>path]:w-full mx-auto mt-8" viewBox="0 0 185 295" alt="PGA Pick'Em" />
            <form className="-mt-32 flex flex-col gap-4 justify-center items-center">
                <input type="email" name="email" className="w-full bg-background/75 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Email' required />
                <input type="password" name="password" className="w-full bg-background/75 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Password' required />
                <br/>
                <button className="bg-brand-green text-black p-2 rounded-lg w-full" formAction={signInAction}>Sign In</button>
                <Link href="/sign-up" className="underline underline-offset-4">Sign Up</Link>
            </form>
        </div>
    )
}