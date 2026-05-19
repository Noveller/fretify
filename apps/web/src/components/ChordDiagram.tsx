import { ParsedChord, Voicing, indexToNote } from '@fretify/core';
import { Fretboard } from './Fretboard';

interface ChordDiagramProps {
  chord: ParsedChord;
  voicings: Voicing[];
  selectedIdx: number;
  onSelectVoicing: (i: number) => void;
}

export function ChordDiagram({ chord, voicings, selectedIdx, onSelectVoicing }: ChordDiagramProps) {
  const noteNames = chord.notes.map(n => indexToNote(n)).join('  ');
  const bassName = indexToNote(chord.bassNote);
  const hasBass = chord.bassNote !== chord.rootNote;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Chord info */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
          {chord.displayName}
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
          {noteNames}
          {hasBass && <span>  ·  бас: <span style={{ color: 'var(--color-dot-root)' }}>{bassName}</span></span>}
        </p>
      </div>

      {/* SVG Fretboard */}
      {voicings.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          <Fretboard
            voicing={voicings[selectedIdx]}
            rootNote={chord.rootNote}
            chordNotes={chord.notes}
          />
        </div>
      )}

      {/* Voicing switcher */}
      {voicings.length > 1 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {voicings.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelectVoicing(i)}
              className="px-3 py-1 rounded-md text-sm font-medium transition"
              style={
                i === selectedIdx
                  ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
                  : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-muted)' }
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {voicings.length === 0 && (
        <p style={{ color: 'var(--color-on-surface-muted)' }} className="text-sm">Позиции не найдены</p>
      )}
    </div>
  );
}
