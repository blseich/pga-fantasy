export default function Filter({
  type,
  callback,
  defaultChecked = false,
}: {
  type: string;
  callback: (s: string) => void;
  defaultChecked?: boolean;
}) {
  return (
    <label className="relative flex cursor-pointer select-none flex-col items-center justify-center gap-2">
      <input
        className="peer sr-only"
        type="radio"
        name="filters"
        onClick={() => callback(type)}
        defaultChecked={defaultChecked}
      />
      <span className="border-brand-blue text-lg peer-checked:border-b-2 peer-checked:text-xl peer-checked:text-brand-green">
        {type}
      </span>
    </label>
  );
}
