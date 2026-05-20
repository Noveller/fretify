import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const QUALITIES: Array<{ label: string; suffix: string; group: string }> = [
  // Basic
  { label: 'maj',   suffix: '',      group: 'basic' },
  { label: 'm',     suffix: 'm',     group: 'basic' },
  { label: '5',     suffix: '5',     group: 'basic' },
  // Seventh
  { label: '7',     suffix: '7',     group: '7th' },
  { label: 'maj7',  suffix: 'maj7',  group: '7th' },
  { label: 'm7',    suffix: 'm7',    group: '7th' },
  { label: 'dim7',  suffix: 'dim7',  group: '7th' },
  // Ninth
  { label: '9',     suffix: '9',     group: '9th' },
  { label: 'maj9',  suffix: 'maj9',  group: '9th' },
  { label: 'm9',    suffix: 'm9',    group: '9th' },
  { label: 'add9',  suffix: 'add9',  group: '9th' },
  // Sixth
  { label: '6',     suffix: '6',     group: '6th' },
  { label: 'm6',    suffix: 'm6',    group: '6th' },
  // Sus
  { label: 'sus2',  suffix: 'sus2',  group: 'sus' },
  { label: 'sus4',  suffix: 'sus4',  group: 'sus' },
  { label: '7sus4', suffix: '7sus4', group: 'sus' },
  // Other
  { label: 'dim',   suffix: 'dim',   group: 'other' },
  { label: 'aug',   suffix: 'aug',   group: 'other' },
  { label: 'm7b5',  suffix: 'm7b5',  group: 'other' },
];

const QUALITY_GROUPS: { key: string; label: string }[] = [
  { key: 'basic', label: '' },
  { key: '7th',   label: '7' },
  { key: '9th',   label: '9' },
  { key: '6th',   label: '6' },
  { key: 'sus',   label: 'sus' },
  { key: 'other', label: '…' },
];

interface ChordBuilderProps {
  onSubmit: (chord: string) => void;
  onClear: () => void;
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

export function ChordBuilder({ onSubmit, onClear }: ChordBuilderProps) {
  const { t } = useTranslation();
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
      onClear();
    } else {
      setRoot(note);
      setBass(null);
    }
  }

  function selectQuality(label: string) {
    if (quality === label) {
      setQuality(null);
      setBass(null);
      onClear();
    } else {
      setQuality(label);
      setBass(null);
    }
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
          {t('chords.sectionNote')}
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
          {t('chords.sectionQuality')}
        </span>
        <div className="flex flex-col gap-1.5">
          {QUALITY_GROUPS.map(group => {
            const items = QUALITIES.filter(q => q.group === group.key);
            return (
              <div key={group.key} className="flex flex-wrap gap-2 items-center">
                {group.label && (
                  <span className="text-xs w-7 shrink-0 font-medium"
                    style={{ color: 'var(--color-on-surface-muted)' }}>
                    {group.label}
                  </span>
                )}
                {items.map(q => (
                  <Chip
                    key={q.label}
                    label={q.label}
                    selected={quality === q.label}
                    dim={root === null}
                    onClick={() => root !== null && selectQuality(q.label)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bass note (optional) */}
      {showBass && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-on-surface-muted)' }}>
            {t('chords.sectionBass')}
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
