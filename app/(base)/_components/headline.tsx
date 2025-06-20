import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type Icon = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

export default function Headline({
  Icon,
  title,
  subTitle,
}: {
  Icon: Icon;
  title: string;
  subTitle?: string;
}) {
  return (
    <div className="mx-auto my-8 flex flex-col items-center justify-center gap-2">
      <Icon className="size-[36px] text-gray-300" />
      <h1 className="text-4xl font-bold">{title}</h1>
      {subTitle && <h2 className="text-brand-blue">{subTitle}</h2>}
    </div>
  );
}
