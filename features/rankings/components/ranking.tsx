import { PropsWithChildren, Children, RefObject } from 'react';

type RankingProps = PropsWithChildren<{
  buttonRef: RefObject<HTMLButtonElement | null> | null;
  onClick: (x: any) => void;
  rank: number;
  isOpen: boolean;
}>;
export default function Ranking({
  buttonRef,
  onClick,
  rank,
  isOpen,
  children,
}: RankingProps) {
  const [Heading, ...Rest] = Children.toArray(children);
  return (
    <button
      style={{ ['--i' as any]: rank }}
      className={`card border border-foreground/10 ${isOpen ? 'w-full p-4' : 'w-10/12 p-2'}`}
      onClick={onClick}
      ref={buttonRef}
    >
      {Heading}
      <div
        className={`${isOpen ? 'max-h-80' : 'max-h-0'} overflow-hidden bg-black transition-all duration-500 ease-out`}
      >
        {Rest}
      </div>
    </button>
  );
}
