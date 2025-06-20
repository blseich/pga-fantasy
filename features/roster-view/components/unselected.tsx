import { User2 } from 'lucide-react';
import PickerLink from './picker-link';

export default async function UnselectedGolfer({ bucket }: { bucket: string }) {
  return (
    <div className="mb-4 flex w-full items-end gap-2 border-b-2 pb-2">
      <div className="relative flex size-[108px] flex-col justify-end overflow-hidden">
        <User2 className="absolute left-0 top-0 -z-10 size-[108px]" />
        <div className="bottom-0 w-full bg-brand-blue text-center text-sm text-black">
          {bucket}
        </div>
      </div>
      <div className="grid grow grid-cols-[auto_85px] grid-rows-[52px_40px] gap-x-2 gap-y-4 pr-2">
        <div className="row-span-2 flex flex-col justify-center">
          <div className="text-sm">Make a</div>
          <div className="text-2xl">Selection</div>
        </div>
        <div className="row-span-2 flex items-center">
          <PickerLink bucket={bucket} />
        </div>
      </div>
    </div>
  );
}
