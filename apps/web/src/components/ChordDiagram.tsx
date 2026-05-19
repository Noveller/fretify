import { useState, useCallback } from 'react';
import { ParsedChord, Voicing, indexToNote } from '@fretify/core';
import { Fretboard } from './Fretboard';
import { playChord } from '../audio/karplusStrong';

interface ChordDiagramProps {
  chord: ParsedChord;
  voicings: Voicing[];
  selectedIdx: number;
  onSelectVoicing: (i: number) => void;
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <polygon points="3,1 15,8 3,15" />
    </svg>
  );
}

export function ChordDiagram({ chord, voicings, selectedIdx, onSelectVoicing }: ChordDiagramProps) {
  const [playing, setPlaying] = useState(false);
  const noteNames = chord.notes.map(n => indexToNote(n)).join('  ');
  const bassName = indexToNote(chord.bassNote);
  const hasBass = chord.bassNote !== chord.rootNote;

  const handlePlay = useCallback(async () => {
    if (playing || voicings.length === 0) return;
    setPlaying(true);
    await playChord(voicings[selectedIdx].frets);
    // Visual feedback: reset after ~strum duration
    setTimeout(() => setPlaying(false), voicings[selectedIdx].frets.filter(f => f >= 0).length * 70 + 100);
  }, [playing, voicings, selectedIdx]);

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
          className="rounded-xl p-6 flex flex-col items-center gap-4"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          <Fretboard
            voicing={voicings[selectedIdx]}
            rootNote={chord.rootNote}
            chordNotes={chord.notes}
          />

          {/* Play button */}
          <button
            onClick={handlePlay}
            disabled={playing}
            title="Воспроизвести аккорд"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{
              backgroundColor: playing ? 'var(--color-accent)' : 'var(--color-surface)',
              color: playing ? 'var(--color-accent-fg)' : 'var(--color-on-surface)',
              border: '1px solid var(--color-fret)',
            }}
          >
            <PlayIcon />
            {playing ? 'Играет...' : 'Воспроизвести'}
          </button>
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
