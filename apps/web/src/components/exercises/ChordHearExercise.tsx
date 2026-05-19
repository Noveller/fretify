import { useState, useEffect } from 'react';
import { playChord } from '../../audio/karplusStrong';
import { CHORD_FRETS } from '../../lessons/lessonData';

interface Props {
  chord: string;
  distractors: [string, string, string];
  disabled: boolean;
  correctAnswer: string; // shown during feedback phase
  onAnswer: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ReplayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.49" />
    </svg>
  );
}

export function ChordHearExercise({ chord, distractors, disabled, correctAnswer, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setSelected(null);
    setOptions(shuffle([chord, ...distractors]));
    const frets = CHORD_FRETS[chord];
    if (frets) playChord(frets);
  }, [chord]);

  function play() {
    const frets = CHORD_FRETS[chord];
    if (frets) playChord(frets);
  }

  function pick(opt: string) {
    if (disabled || selected !== null) return;
    setSelected(opt);
    onAnswer(opt === chord);
  }

  function optionStyle(opt: string): React.CSSProperties {
    if (!disabled || selected === null) {
      // question phase
      return selected === opt
        ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)',
            border: '2px solid var(--color-accent)' }
        : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)',
            border: '2px solid var(--color-fret)' };
    }
    // feedback phase
    if (opt === correctAnswer) {
      return { backgroundColor: '#22c55e20', color: '#16a34a',
        border: '2px solid #22c55e' };
    }
    if (opt === selected && selected !== correctAnswer) {
      return { backgroundColor: '#ef444420', color: '#dc2626',
        border: '2px solid #ef4444' };
    }
    return { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-muted)',
      border: '2px solid var(--color-fret)', opacity: 0.5 };
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-base font-medium text-center" style={{ color: 'var(--color-on-surface-muted)' }}>
        Какой аккорд ты слышишь?
      </p>

      {/* Play button */}
      <button
        onClick={play}
        className="flex flex-col items-center gap-3 transition-all hover:opacity-80 active:scale-95"
      >
        <div className="rounded-full flex items-center justify-center"
          style={{
            width: 100, height: 100,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
            boxShadow: '0 0 0 8px color-mix(in srgb, var(--color-accent) 20%, transparent)',
          }}>
          <ReplayIcon />
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--color-on-surface-muted)' }}>
          Нажми чтобы прослушать
        </span>
      </button>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => pick(opt)}
            disabled={disabled && selected !== null && opt !== correctAnswer && opt !== selected}
            className="py-5 rounded-xl text-xl font-bold transition-all hover:opacity-90 active:scale-95"
            style={optionStyle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
