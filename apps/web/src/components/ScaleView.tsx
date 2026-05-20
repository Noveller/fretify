import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SCALES, type ScaleFormula, indexToNote, noteToIndex, STANDARD_TUNING } from '@fretify/core';
import { ScaleFretboard } from './ScaleFretboard';
import { playScale } from '../audio/scalePlayer';

const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CATEGORIES: ScaleFormula['category'][] = ['scale', 'mode', 'pentatonic'];

// 5 unique frets where the root note appears across all strings — natural position anchors
function rootPositions(rootNote: number): number[] {
  const frets = STANDARD_TUNING.map(open => (rootNote - open + 12) % 12);
  return [...new Set(frets)].sort((a, b) => a - b);
}

function Chip({ label, selected, onClick, dim }: {
  label: string; selected: boolean; onClick: () => void; dim?: boolean;
}) {
  return (
    <button onClick={onClick}
      style={
        selected
          ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
          : dim
          ? { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-muted)', opacity: 0.4 }
          : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)' }
      }
      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80 select-none text-center"
    >{label}</button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--color-on-surface-muted)' }}>{title}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <polygon points="3,1 15,8 3,15" />
    </svg>
  );
}

export function ScaleView() {
  const { t } = useTranslation();
  const scaleNames = t('scales.names', { returnObjects: true }) as Record<string, string>;
  const tScale = (name: string) => scaleNames[name] ?? name;

  const CATEGORY_LABELS: Record<ScaleFormula['category'], string> = {
    scale:      t('scales.categoryScale'),
    mode:       t('scales.categoryMode'),
    pentatonic: t('scales.categoryPentatonic'),
  };

  const [rootName, setRootName]       = useState<string | null>(null);
  const [scaleName, setScaleName]     = useState<string | null>(null);
  const [posIdx, setPosIdx]           = useState<number | null>(null); // null = all positions
  const [playing, setPlaying]         = useState(false);

  const rootNote = rootName !== null ? noteToIndex(rootName) : null;
  const formula  = scaleName ? SCALES.find(s => s.name === scaleName) ?? null : null;

  const scaleNotes: Set<number> = (rootNote !== null && formula)
    ? new Set(formula.intervals.map(i => (rootNote + i) % 12))
    : new Set();

  const noteNames = (rootNote !== null && formula)
    ? formula.intervals.map(i => indexToNote((rootNote + i) % 12))
    : [];

  const positions = rootNote !== null ? rootPositions(rootNote) : [];
  const activeWindow: [number, number] | undefined =
    posIdx !== null && positions[posIdx] !== undefined
      ? [positions[posIdx], positions[posIdx] + 4]
      : undefined;

  async function handlePlay() {
    if (!formula || rootNote === null || playing) return;
    setPlaying(true);
    const duration = await playScale(rootNote, formula.intervals);
    setTimeout(() => setPlaying(false), duration);
  }

  function toggleRoot(note: string) {
    setRootName(prev => prev === note ? null : note);
    setPosIdx(null);
  }

  function toggleScale(name: string) {
    setScaleName(prev => prev === name ? null : name);
    setPosIdx(null);
  }

  const ready = rootNote !== null && formula !== null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Root note */}
      <Section title={t('scales.sectionNote')}>
        {ROOT_NOTES.map(note => (
          <Chip key={note} label={note} selected={rootName === note} onClick={() => toggleRoot(note)} />
        ))}
      </Section>

      {/* Scales by category */}
      {CATEGORIES.map(cat => (
        <Section key={cat} title={CATEGORY_LABELS[cat]}>
          {SCALES.filter(s => s.category === cat).map(s => (
            <Chip key={s.name} label={tScale(s.name)} selected={scaleName === s.name}
              dim={rootName === null} onClick={() => rootName !== null && toggleScale(s.name)} />
          ))}
        </Section>
      ))}

      {/* Fretboard + controls */}
      {ready && (
        <div className="rounded-xl p-3 sm:p-4 flex flex-col gap-4"
          style={{ backgroundColor: 'var(--color-surface-2)' }}>

          {/* Header row */}
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-2 sm:gap-3">
            <div>
              <span className="text-base sm:text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
                {rootName} {tScale(formula!.name)}
              </span>
              <span className="ml-2 sm:ml-3 text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
                {noteNames.join(' · ')}
              </span>
            </div>

            {/* Play button */}
            <button
              onClick={handlePlay}
              disabled={playing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              style={{
                backgroundColor: playing ? 'var(--color-accent)' : 'var(--color-surface)',
                color: playing ? 'var(--color-accent-fg)' : 'var(--color-on-surface)',
                border: '1px solid var(--color-fret)',
              }}
            >
              <PlayIcon />
              {playing ? t('common.playing') : t('common.play')}
            </button>
          </div>

          {/* Position selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium uppercase tracking-widest mr-1"
              style={{ color: 'var(--color-on-surface-muted)' }}>{t('scales.sectionPosition')}</span>
            <Chip label={t('common.all')} selected={posIdx === null} onClick={() => setPosIdx(null)} />
            {positions.map((startFret, i) => (
              <Chip
                key={i}
                label={`${['I','II','III','IV','V'][i]}  ${startFret}-${startFret + 4}`}
                selected={posIdx === i}
                onClick={() => setPosIdx(prev => prev === i ? null : i)}
              />
            ))}
          </div>

          {/* Fretboard */}
          <ScaleFretboard rootNote={rootNote!} scaleNotes={scaleNotes} activeWindow={activeWindow} />
        </div>
      )}

      {!ready && (
        <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
          {t('scales.selectHint')}
        </p>
      )}
    </div>
  );
}
