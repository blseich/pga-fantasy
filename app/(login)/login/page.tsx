import Link from 'next/link';
import GolfBallSvg from './53678130-golf-ball-on-tee.svg';

export default function LoginPage() {
    return (
        <div className="relative w-full p-8">
            <GolfBallSvg className="w-5/6 h-auto [&>path]:w-full mx-auto mt-8" viewBox="0 0 185 295" alt="PGA Pick'Em" />
            <div className="-mt-32 flex flex-col gap-4 justify-center items-center">
                <input type="text" className="w-full bg-background bg-opacity-25 text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Username' />
                <input type="password" className="w-full bg-background text-foreground border-brand-blue border-solid border-2 p-2" placeholder='Password' />
                <br/>
                <br/>
                <button className="bg-brand-green text-black p-2 rounded-lg w-full">Sign In</button>
                <Link href="/sign-up" className="underline underline-offset-4">Sign Up</Link>
            </div>
        </div>
    )
}