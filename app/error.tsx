'use client';
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="mt-8 flex flex-col items-center gap-8">
            <h1 className="text-4xl font-black">WHOOPS!</h1>
            <Image src="/error-graphic.png" alt="Fore!" height={212} width={206} />
            <h2 className="text-xl">Something went wrong...</h2>
            <p className="text-center px-4">Try refreshing or returning to the <Link className="underline underline-offset-4 text-brand-blue" href="/">homepage</Link>. If the problem persists please let Seich know and give steps to reproduce the problem.</p>
            <p>Thanks!</p>
        </div>
    )
}