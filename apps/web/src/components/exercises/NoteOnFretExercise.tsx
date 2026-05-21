import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { indexToNote, STANDARD_TUNING } from '@fretify/core';
import { playNote } from '../../audio/karplusStrong';

interface Props {
  stringIdx: number;
  fret: number;
  distractors: [string, string, string];
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
}

const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
const FRETS_SHOWN = 5;
const FRET_W = 46;
const STR_H = 24;
const PAD_L = 32;
const PAD_T = 22;
const PAD_B = 12;
const PAD_R = 16;
const DOT_R = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MiniFretboard({ stringIdx, fret }: { stringIdx: number; fret: number }) {
  const startFret = fret <= 2 ? 0 : fret - 2;
  const endFret   = startFret + FRETS_SHOWN;

  const svgW = PAD_L + FRETS_SHOWN * FRET_W + PAD_R;
  const svgH = PAD_T + 5 * STR_H + PAD_B;

  const fretX = (f: number) => PAD_L + (f - startFret) * FRET_W;
  const strY  = (si: number) => PAD_T + si * STR_H;
  const dotX  = (f: number) => fret === 0
    ? PAD_L / 2
    : PAD_L + (f - startFret - 0.5) * FRET_W;

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Fret number labels */}
      {Array.from({ length: FRETS_SHOWN + 1 }, (_, i) => startFret + i).map(f => (
        f > 0 && (
          <text key={f} x={fretX(f)} y={PAD_T - 6} textAnchor="middle" fontSize={10}
            fill="var(--color-on-surface-muted)">{f}</text>
        )
      ))}

      {/* Nut */}
      {startFret === 0 && (
        <rect x={PAD_L - 3} y={strY(0) - 4}
          width={6} height={5 * STR_H + 8}
          rx={2} fill="var(--color-nut)" />
      )}

      {/* Fret lines */}
      {Array.from({ length: FRETS_SHOWN }, (_, i) => startFret + i + 1).map(f =>
        f <= endFret && (
          <line key={f} x1={fretX(f)} y1={strY(0)} x2={fretX(f)} y2={strY(5)}
            stroke="var(--color-fret)" strokeWidth={1.5} />
        )
      )}

      {/* String lines */}
      {Array.from({ length: 6 }, (_, si) => (
        <line key={si} x1={startFret === 0 ? PAD_L - 3 : 0} y1={strY(si)}
          x2={svgW} y2={strY(si)}
          stroke={si === stringIdx ? 'var(--color-accent)' : 'var(--color-string)'}
          strokeWidth={si === stringIdx ? 2.5 : 2 - si * 0.2}
          opacity={si === stringIdx ? 1 : 0.4}
        />
      ))}

      {/* String name labels */}
      {Array.from({ length: 6 }, (_, si) => (
        <text key={si} x={startFret === 0 ? 6 : svgW - 4}
          y={strY(si) + 4}
          textAnchor={startFret === 0 ? 'start' : 'end'}
          fontSize={10} fontWeight={si === stringIdx ? '700' : '400'}
          fill={si === stringIdx ? 'var(--color-accent)' : 'var(--color-on-surface-muted)'}>
          {STRING_NAMES[si]}
        </text>
      ))}

      {/* Target dot */}
      <circle
        cx={dotX(fret)} cy={strY(stringIdx)}
        r={DOT_R}
        fill="var(--color-accent)"
        opacity={0.9}
      />
      <text x={dotX(fret)} y={strY(stringIdx) + 4}
        textAnchor="middle" fontSize={11} fontWeight="700"
        fill="var(--color-accent-fg)">?</text>
    </svg>
  );
}

export function NoteOnFretExercise({ stringIdx, fret, distractors, disabled, onAnswer }: Props) {
  const { t } = useTranslation();
  const correctNote = indexToNote((STANDARD_TUNING[stringIdx] + fret) % 12);
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions]   = useState<string[]>([]);

  useEffect(() => {
    setSelected(null);
    setOptions(shuffle([correctNote, ...distractors]));
    playNote(stringIdx, fret);
  }, [stringIdx, fret]);

  function pick(opt: string) {
    if (disabled || selected !== null) return;
    setSelected(opt);
    onAnswer(opt === correctNote);
  }

  function optionStyle(opt: string): React.CSSProperties {
    if (!disabled || selected === null) {
      return selected === opt
        ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', border: '2px solid var(--color-accent)' }
        : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)', border: '2px solid var(--color-fret)' };
    }
    if (opt === correctNote)
      return { backgroundColor: '#22c55e20', color: '#16a34a', border: '2px solid #22c55e' };
    if (opt === selected && selected !== correctNote)
      return { backgroundColor: '#ef444420', color: '#dc2626', border: '2px solid #ef4444' };
    return { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-muted)', border: '2px solid var(--color-fret)', opacity: 0.5 };
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-base font-medium text-center" style={{ color: 'var(--color-on-surface-muted)' }}>
        {t('lessons.noteOnFretPrompt')}
      </p>

      <button onClick={() => playNote(stringIdx, fret)}
        className="flex flex-col items-center gap-3 transition-all hover:opacity-80 active:scale-95">
        <div className="rounded-2xl p-4 overflow-x-auto"
          style={{ backgroundColor: 'var(--color-surface-2)' }}>
          <MiniFretboard stringIdx={stringIdx} fret={fret} />
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--color-on-surface-muted)' }}>
          {t('lessons.clickToListen')}
        </span>
      </button>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {options.map(opt => (
          <button key={opt} onClick={() => pick(opt)}
            disabled={disabled && selected !== null && opt !== correctNote && opt !== selected}
            className="py-5 rounded-xl text-xl font-bold transition-all hover:opacity-90 active:scale-95"
            style={optionStyle(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
