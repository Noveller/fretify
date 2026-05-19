import { useState, useEffect, useRef } from 'react';
import { indexToNote, SCALES } from '@fretify/core';
import { playScale } from '../../audio/scalePlayer';

function label(name: string): string {
  const found = SCALES.find(s => s.name === name);
  return found?.category === 'pentatonic' ? `${name} (пент.)` : name;
}

interface Props {
  rootNote: number;
  scale: string;
  distractors: [string, string, string];
  disabled: boolean;
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

function PlayIcon({ spinning }: { spinning: boolean }) {
  if (spinning) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round"
        style={{ animation: 'spin 1s linear infinite' }}>
        <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.49" />
    </svg>
  );
}

export function ScaleHearExercise({ rootNote, scale, distractors, disabled, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);

  async function startPlay(rn: number, sc: string) {
    if (playingRef.current) return;
    const formula = SCALES.find(s => s.name === sc);
    if (!formula) return;
    playingRef.current = true;
    setPlaying(true);
    const duration = await playScale(rn, formula.intervals, 0.32);
    setTimeout(() => { playingRef.current = false; setPlaying(false); }, duration);
  }

  useEffect(() => {
    setSelected(null);
    setOptions(shuffle([scale, ...distractors]));
    startPlay(rootNote, scale);
  }, [scale, rootNote]);

  function pick(opt: string) {
    if (disabled || selected !== null) return;
    setSelected(opt);
    onAnswer(opt === scale);
  }

  function optionStyle(opt: string): React.CSSProperties {
    if (!disabled || selected === null) {
      return selected === opt
        ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)',
            border: '2px solid var(--color-accent)' }
        : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)',
            border: '2px solid var(--color-fret)' };
    }
    if (opt === scale) {
      return { backgroundColor: '#22c55e20', color: '#16a34a', border: '2px solid #22c55e' };
    }
    if (opt === selected && selected !== scale) {
      return { backgroundColor: '#ef444420', color: '#dc2626', border: '2px solid #ef4444' };
    }
    return { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-muted)',
      border: '2px solid var(--color-fret)', opacity: 0.5 };
  }

  const rootName = indexToNote(rootNote);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-base font-medium text-center" style={{ color: 'var(--color-on-surface-muted)' }}>
        Какая гамма звучит от ноты <strong style={{ color: 'var(--color-on-surface)' }}>{rootName}</strong>?
      </p>

      {/* Play button */}
      <button
        onClick={() => startPlay(rootNote, scale)}
        disabled={playing}
        className="flex flex-col items-center gap-3 transition-all hover:opacity-80 active:scale-95 disabled:cursor-default"
      >
        <div className="rounded-full flex items-center justify-center"
          style={{
            width: 100, height: 100,
            backgroundColor: playing ? 'var(--color-surface-2)' : 'var(--color-accent)',
            color: playing ? 'var(--color-on-surface-muted)' : 'var(--color-accent-fg)',
            boxShadow: playing
              ? 'none'
              : '0 0 0 8px color-mix(in srgb, var(--color-accent) 20%, transparent)',
            transition: 'background-color 0.2s, box-shadow 0.2s',
          }}>
          <PlayIcon spinning={playing} />
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--color-on-surface-muted)' }}>
          {playing ? 'Играет...' : 'Нажми чтобы прослушать'}
        </span>
      </button>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => pick(opt)}
            disabled={disabled && selected !== null && opt !== scale && opt !== selected}
            className="py-4 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 leading-tight px-2"
            style={optionStyle(opt)}
          >
            {label(opt)}
          </button>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
