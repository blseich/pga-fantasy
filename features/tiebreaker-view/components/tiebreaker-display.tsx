export default function TiebreakerDisplay({ score }: { score?: number }) {
  const scoreDisplay =
    score === undefined
      ? '-'
      : score === 0
        ? 'E'
        : score > 0
          ? `+${score}`
          : score;
  return (
    <div className="grid aspect-square w-12 place-items-center border-2 border-brand-blue">
      {scoreDisplay}
    </div>
  );
}
