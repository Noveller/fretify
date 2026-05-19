import { useState } from 'react';
import type { ExerciseDef } from './lessonData';

export type Phase = 'question' | 'feedback' | 'complete' | 'failed';

interface State {
  idx: number;
  lives: number;
  xp: number;
  phase: Phase;
  lastCorrect: boolean | null;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INITIAL: State = { idx: 0, lives: 3, xp: 0, phase: 'question', lastCorrect: null };

export function useLessonEngine(exercises: ExerciseDef[]) {
  const [queue, setQueue] = useState(() => shuffled(exercises));
  const [state, setState] = useState<State>(INITIAL);

  function submit(correct: boolean) {
    setState(prev => ({
      ...prev,
      lives: correct ? prev.lives : prev.lives - 1,
      xp:    correct ? prev.xp + 10 : prev.xp,
      phase: 'feedback',
      lastCorrect: correct,
    }));
  }

  function advance() {
    setState(prev => {
      if (!prev.lastCorrect && prev.lives - 1 <= 0) return { ...prev, phase: 'failed' };
      if (prev.lives <= 0) return { ...prev, phase: 'failed' };
      const next = prev.idx + 1;
      if (next >= exercises.length) return { ...prev, phase: 'complete' };
      return { ...prev, idx: next, phase: 'question', lastCorrect: null };
    });
  }

  function reset() {
    setQueue(shuffled(exercises));
    setState(INITIAL);
  }

  return {
    exercise:    queue[state.idx],
    idx:         state.idx,
    total:       exercises.length,
    lives:       state.lives,
    xp:          state.xp,
    phase:       state.phase,
    lastCorrect: state.lastCorrect,
    submit,
    advance,
    reset,
  };
}
