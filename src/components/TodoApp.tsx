import { useMemo, useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import type { Filter } from '@/types/todo';
import { TodoInput } from '@/components/TodoInput';
import { TodoItem } from '@/components/TodoItem';
import { FilterTabs } from '@/components/FilterTabs';
import { EmptyState } from '@/components/EmptyState';

export function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Todos<span className="text-indigo-600">.</span>
          </h1>
          <p className="mt-2 text-slate-500">Keep track of what matters. Double-click a todo to edit it.</p>
        </header>

        <section
          aria-label="Todo list"
          className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-xl shadow-indigo-100/50 backdrop-blur"
        >
          <div className="border-b border-slate-100 p-4">
            <TodoInput onAdd={addTodo} />
          </div>

          {todos.length > 0 && (
            <div className="flex justify-center border-b border-slate-100 px-4 py-3 sm:justify-start">
              <FilterTabs value={filter} onChange={setFilter} />
            </div>
          )}

          {visible.length === 0 ? (
            <EmptyState filter={filter} hasTodos={todos.length > 0} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {visible.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
              ))}
            </ul>
          )}

          {todos.length > 0 && (
            <footer className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-500">
              <span aria-live="polite">
                <strong className="font-semibold text-slate-700">{activeCount}</strong>{' '}
                {activeCount === 1 ? 'item' : 'items'} left
              </span>
              <button
                type="button"
                onClick={clearCompleted}
                disabled={completedCount === 0}
                className="rounded-lg px-2 py-1 font-medium transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              >
                Clear completed
              </button>
            </footer>
          )}
        </section>
      </div>
    </main>
  );
}
