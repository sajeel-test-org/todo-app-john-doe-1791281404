import type { Filter } from '@/types/todo';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

interface FilterTabsProps {
  value: Filter;
  onChange: (filter: Filter) => void;
}

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div role="group" aria-label="Filter todos" className="inline-flex rounded-xl bg-slate-100 p-1">
      {FILTERS.map((f) => {
        const active = f.value === value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
            aria-pressed={active}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
              active ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
