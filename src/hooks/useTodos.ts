import { useCallback, useEffect, useState } from 'react';
import type { Todo } from '@/types/todo';

const STORAGE_KEY = 'todos:v1';

function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Todo =>
        typeof t === 'object' &&
        t !== null &&
        typeof (t as Todo).id === 'string' &&
        typeof (t as Todo).title === 'string' &&
        typeof (t as Todo).completed === 'boolean',
    );
  } catch {
    return [];
  }
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // storage unavailable (quota / private mode) — keep in-memory state
    }
  }, [todos]);

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: makeId(), title: trimmed, completed: false, createdAt: Date.now() }]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTodo = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    setTodos((prev) =>
      trimmed ? prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)) : prev.filter((t) => t.id !== id),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted };
}
