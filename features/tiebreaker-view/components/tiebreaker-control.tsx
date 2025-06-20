import { ReactNode } from 'react';

export default function TieBreakerControl({
  children,
  callback,
}: {
  children: ReactNode;
  callback: () => void;
}) {
  return (
    <button
      className="aspect-square w-12 text-2xl font-bold text-brand-green"
      onClick={callback}
    >
      {children}
    </button>
  );
}
