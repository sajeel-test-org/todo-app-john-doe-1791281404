import type { Filter } from '@/types/todo';

interface EmptyStateProps {
  filter: Filter;
  hasTodos: boolean;
}

export function EmptyState({ filter, hasTodos }: EmptyStateProps) {
  let title = 'Nothing to do yet';
  let message = 'Add your first todo above to get started.';
  let emoji = '📝';

  if (hasTodos && filter === 'active') {
    title = 'All caught up!';
    message = 'Every todo is done. Enjoy the moment.';
    emoji = '🎉';
  } else if (hasTodos && filter === 'completed') {
    title = 'No completed todos';
    message = 'Check something off and it will show up here.';
    emoji = '✅';
  }

  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
