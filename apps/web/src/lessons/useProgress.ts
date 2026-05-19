import { useState } from 'react';

const KEY = 'fretify:completed';

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(load);

  function markComplete(lessonId: string) {
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(lessonId);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return { completed, markComplete };
}
