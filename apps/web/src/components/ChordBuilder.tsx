import { useState, useEffect } from 'react';

const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const QUALITIES: Array<{ label: string; suffix: string }> = [
  { label: 'maj',   suffix: '' },
  { label: 'm',     suffix: 'm' },
  { label: '7',     suffix: '7' },
  { label: 'maj7',  suffix: 'maj7' },
  { label: 'm7',    suffix: 'm7' },
  { label: '6',     suffix: '6' },
  { label: '9',     suffix: '9' },
  { label: 'm9',    suffix: 'm9' },
  { label: 'maj9',  suffix: 'maj9' },
  { label: 'sus2',  suffix: 'sus2' },
  { label: 'sus4',  suffix: 'sus4' },
  { label: '7sus4', suffix: '7sus4' },
  { label: 'dim',   suffix: 'dim' },
  { label: 'dim7',  suffix: 'dim7' },
  { label: 'aug',   suffix: 'aug' },
  { label: 'm7b5',  suffix: 'm7b5' },
  { label: 'add9',  suffix: 'add9' },
  { label: '5',     suffix: '5' },
];

interface ChordBuilderProps {
  onSubmit: (chord: string) => void;
}

function Chip({
  label,
  selected,
  onClick,
  dim,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  dim?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={
        selected
          ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
          : dim
          ? { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-muted)', opacity: 0.5 }
          : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)' }
      }
      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80 select-none min-w-[2.75rem] text-center"
    >
      {label}
    </button>
  );
}

export function ChordBuilder({ onSubmit }: ChordBuilderProps) {
  const [root, setRoot] = useState<string | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [bass, setBass] = useState<string | null>(null);

  useEffect(() => {
    if (root === null || quality === null) return;
    const q = QUALITIES.find(q => q.label === quality);
    if (!q) return;
    const chord = `${root}${q.suffix}${bass ? `/${bass}` : ''}`;
    onSubmit(chord);
  }, [root, quality, bass]);

  function selectRoot(note: string) {
    if (root === note) {
      setRoot(null);
      setQuality(null);
      setBass(null);
    } else {
      setRoot(note);
      setBass(null);
      // quality сохраняется — useEffect сразу показывает новый аккорд
    }
  }

  function selectQuality(label: string) {
    setQuality(prev => (prev === label ? null : label));
    setBass(null);
  }

  function selectBass(note: string) {
    setBass(prev => (prev === note ? null : note));
  }

  const showBass = root !== null && quality !== null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Root note */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-on-surface-muted)' }}>
          Нота
        </span>
        <div className="flex flex-wrap gap-2">
          {ROOT_NOTES.map(note => (
            <Chip
              key={note}
              label={note}
              selected={root === note}
              onClick={() => selectRoot(note)}
            />
          ))}
        </div>
      </div>

      {/* Chord quality */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-on-surface-muted)' }}>
          Тип
        </span>
        <div className="flex flex-wrap gap-2">
          {QUALITIES.map(q => (
            <Chip
              key={q.label}
              label={q.label}
              selected={quality === q.label}
              dim={root === null}
              onClick={() => root !== null && selectQuality(q.label)}
            />
          ))}
        </div>
      </div>

      {/* Bass note (optional) */}
      {showBass && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-on-surface-muted)' }}>
            Бас (опционально)
          </span>
          <div className="flex flex-wrap gap-2">
            <Chip
              key="none"
              label="—"
              selected={bass === null}
              onClick={() => setBass(null)}
            />
            {ROOT_NOTES.map(note => (
              <Chip
                key={note}
                label={note}
                selected={bass === note}
                onClick={() => selectBass(note)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
