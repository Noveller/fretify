import { Voicing, STANDARD_TUNING, indexToNote } from '@fretify/core';

interface FretboardProps {
  voicing: Voicing;
  rootNote: number;
  chordNotes: number[];
  tuning?: number[];
}

const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
const FRETS_SHOWN = 5;
const STRING_SPACING = 34;
const FRET_SPACING = 44;
const PADDING_LEFT = 36;
const PADDING_TOP = 40;
const DOT_RADIUS = 13;

export function Fretboard({ voicing, rootNote, chordNotes: _chordNotes, tuning = STANDARD_TUNING }: FretboardProps) {
  const { frets, startFret } = voicing;
  const numStrings = tuning.length;
  const width = PADDING_LEFT + (numStrings - 1) * STRING_SPACING + 36;
  const height = PADDING_TOP + FRETS_SHOWN * FRET_SPACING + 20;

  // SVG coordinate: string i → x = PADDING_LEFT + i * STRING_SPACING
  // fret f → y = PADDING_TOP + f * FRET_SPACING (f=0 is nut/top)

  function stringX(i: number) { return PADDING_LEFT + i * STRING_SPACING; }
  function fretY(f: number) { return PADDING_TOP + f * FRET_SPACING; }

  // Note at each string position
  function noteAtString(si: number, f: number) {
    if (f < 0) return null;
    return (tuning[si] + f) % 12;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Nut or position marker */}
      {startFret === 0 ? (
        <rect
          x={PADDING_LEFT - 3}
          y={PADDING_TOP - 4}
          width={(numStrings - 1) * STRING_SPACING + 6}
          height={6}
          fill="var(--color-nut)"
          rx={2}
        />
      ) : (
        <text
          x={PADDING_LEFT - 10}
          y={fretY(0.5) + 5}
          textAnchor="end"
          fontSize={12}
          fill="var(--color-on-surface-muted)"
        >{startFret}fr</text>
      )}

      {/* Fret lines */}
      {Array.from({ length: FRETS_SHOWN + 1 }, (_, fi) => (
        <line
          key={fi}
          x1={PADDING_LEFT}
          y1={fretY(fi)}
          x2={PADDING_LEFT + (numStrings - 1) * STRING_SPACING}
          y2={fretY(fi)}
          stroke="var(--color-fret)"
          strokeWidth={fi === 0 && startFret === 0 ? 0 : 1.5}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: numStrings }, (_, si) => (
        <line
          key={si}
          x1={stringX(si)}
          y1={fretY(0)}
          x2={stringX(si)}
          y2={fretY(FRETS_SHOWN)}
          stroke="var(--color-string)"
          strokeWidth={2.5 - si * 0.25}
        />
      ))}

      {/* String names at bottom */}
      {STRING_NAMES.map((name, si) => (
        <text
          key={si}
          x={stringX(si)}
          y={height - 4}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-on-surface-muted)"
        >{name}</text>
      ))}

      {/* Finger dots and markers */}
      {frets.map((fret, si) => {
        const x = stringX(si);
        if (fret < 0) {
          // Muted X above nut
          return (
            <text key={si} x={x} y={PADDING_TOP - 14} textAnchor="middle" fontSize={14} fill="var(--color-on-surface-muted)">×</text>
          );
        }
        if (fret === 0) {
          const note = noteAtString(si, 0)!;
          const isRoot = note === rootNote;
          const color = isRoot ? 'var(--color-dot-root)' : 'var(--color-dot)';
          const noteName = indexToNote(note);
          return (
            <g key={si}>
              <circle cx={x} cy={PADDING_TOP - 14} r={DOT_RADIUS} fill="none" stroke={color} strokeWidth={1.5} />
              <text x={x} y={PADDING_TOP - 10} textAnchor="middle" fontSize={10} fontWeight="600" fill={color}>{noteName}</text>
            </g>
          );
        }
        // Fretted dot
        const relFret = startFret === 0 ? fret : fret - startFret + 1;
        const y = fretY(relFret - 0.5);
        const note = noteAtString(si, fret)!;
        const isRoot = note === rootNote;
        const dotColor = isRoot ? 'var(--color-dot-root)' : 'var(--color-dot)';
        const dotFg = isRoot ? 'var(--color-dot-root-fg)' : 'var(--color-dot-fg)';
        const noteName = indexToNote(note);
        return (
          <g key={si}>
            <circle cx={x} cy={y} r={DOT_RADIUS} fill={dotColor} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight="600" fill={dotFg}>{noteName}</text>
          </g>
        );
      })}
    </svg>
  );
}
