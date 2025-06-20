import Link from 'next/link';
import LogoSvg from '../assets/logo.svg';

export default function HomeIconLink() {
  return (
    <Link className="flex items-center gap-1" href="/">
      <LogoSvg />
      <div className="flex flex-col items-end">
        <p className="text-lg font-black text-brand-green">PGA</p>
        <p className="text-xs">Pick&apos;Em</p>
      </div>
    </Link>
  );
}
