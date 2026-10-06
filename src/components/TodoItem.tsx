import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEdit() {
    cancelledRef.current = false;
    setDraft(todo.title);
    setEditing(true);
  }

  function commit() {
    if (cancelledRef.current) return;
    cancelledRef.current = true; // prevent a second commit from the unmount blur
    setEditing(false);
    if (draft.trim() !== todo.title) onEdit(todo.id, draft);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelledRef.current = true;
      setDraft(todo.title);
      setEditing(false);
    }
  }

  const checkboxId = `todo-${todo.id}`;

  return (
    <li className="group flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
      <input
        id={checkboxId}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'active' : 'completed'}`}
        className="h-5 w-5 shrink-0 cursor-pointer rounded-md border-slate-300 accent-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
      />
      {editing ? (
        <>
          <label htmlFor={`${checkboxId}-edit`} className="sr-only">
            Edit todo
          </label>
          <input
            id={`${checkboxId}-edit`}
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            className="min-w-0 flex-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
        </>
      ) : (
        <span
          onDoubleClick={startEdit}
          title="Double-click to edit"
          className={`min-w-0 flex-1 cursor-text select-none break-words py-1.5 transition ${
            todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
          }`}
        >
          {todo.title}
        </span>
      )}
      {!editing && (
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 opacity-100 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </li>
  );
}
