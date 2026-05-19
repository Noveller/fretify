import { indexToNote, STANDARD_TUNING } from '@fretify/core';
import { playNote } from '../audio/karplusStrong';

interface ScaleFretboardProps {
  rootNote: number;
  scaleNotes: Set<number>;
  activeWindow?: [number, number]; // [startFret, endFret] inclusive
  tuning?: number[];
}

const FRET_WIDTH = 38;
const STRING_SPACING = 30;
const PAD_LEFT = 28;
const PAD_TOP = 22;
const PAD_BOTTOM = 20;
const DOT_R = 11;
const MAX_FRET = 14;
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
const INLAY_FRETS = [3, 5, 7, 9];
const LABELED_FRETS = [3, 5, 7, 9, 12];

const svgW = PAD_LEFT + MAX_FRET * FRET_WIDTH + 24;
const svgH = PAD_TOP + 5 * STRING_SPACING + PAD_BOTTOM;

const fretX = (f: number) => PAD_LEFT + f * FRET_WIDTH;
const dotX  = (f: number) => f === 0 ? PAD_LEFT / 2 : PAD_LEFT + (f - 0.5) * FRET_WIDTH;
const strY  = (si: number) => PAD_TOP + (5 - si) * STRING_SPACING;

export function ScaleFretboard({ rootNote, scaleNotes, activeWindow, tuning = STANDARD_TUNING }: ScaleFretboardProps) {
  const topY = strY(5);
  const botY = strY(0);
  const inWindow = (fret: number) =>
    !activeWindow || (fret >= activeWindow[0] && fret <= activeWindow[1]);

  // Shading rect for active position
  const shadeX     = activeWindow ? (activeWindow[0] === 0 ? 0 : fretX(activeWindow[0]) - FRET_WIDTH / 2) : 0;
  const shadeRight = activeWindow ? fretX(activeWindow[1]) + FRET_WIDTH / 2 : 0;

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ fontFamily: 'system-ui, sans-serif', display: 'block' }}>

        {/* Fret number labels */}
        {LABELED_FRETS.map(f => (
          <text key={f} x={dotX(f)} y={PAD_TOP - 8} textAnchor="middle" fontSize={9}
            fill="var(--color-on-surface-muted)">{f}</text>
        ))}

        {/* Active position highlight */}
        {activeWindow && (
          <rect x={shadeX} y={topY - 4} width={shadeRight - shadeX} height={botY - topY + 8}
            fill="var(--color-accent)" opacity={0.08} rx={4} />
        )}

        {/* Nut */}
        <line x1={fretX(0)} y1={topY} x2={fretX(0)} y2={botY}
          stroke="var(--color-nut)" strokeWidth={5} strokeLinecap="round" />

        {/* Fret lines */}
        {Array.from({ length: MAX_FRET }, (_, i) => i + 1).map(f => (
          <line key={f} x1={fretX(f)} y1={topY} x2={fretX(f)} y2={botY}
            stroke="var(--color-fret)" strokeWidth={1.5} />
        ))}

        {/* Strings */}
        {Array.from({ length: 6 }, (_, si) => (
          <line key={si} x1={0} y1={strY(si)} x2={svgW} y2={strY(si)}
            stroke="var(--color-string)" strokeWidth={2.5 - si * 0.25} />
        ))}

        {/* String labels */}
        {STRING_NAMES.map((name, si) => (
          <text key={si} x={svgW - 4} y={strY(si) + 4} textAnchor="end"
            fontSize={10} fontWeight="600" fill="var(--color-on-surface-muted)">{name}</text>
        ))}

        {/* Inlay dots */}
        {INLAY_FRETS.map(f => (
          <circle key={f} cx={dotX(f)} cy={botY + 10} r={3} fill="var(--color-fret)" />
        ))}
        <circle cx={dotX(12)} cy={botY + 7} r={3} fill="var(--color-fret)" />
        <circle cx={dotX(12)} cy={botY + 14} r={3} fill="var(--color-fret)" />

        {/* Scale dots */}
        {Array.from({ length: 6 }, (_, si) =>
          Array.from({ length: MAX_FRET + 1 }, (_, fret) => {
            const noteIdx = (tuning[si] + fret) % 12;
            if (!scaleNotes.has(noteIdx)) return null;
            const isRoot = noteIdx === rootNote;
            const active = inWindow(fret);
            const cx = dotX(fret);
            const cy = strY(si);
            const fill = isRoot ? 'var(--color-dot-root)' : 'var(--color-dot)';
            const fg   = isRoot ? 'var(--color-dot-root-fg)' : 'var(--color-dot-fg)';
            const name = indexToNote(noteIdx);
            return (
              <g key={`${si}-${fret}`} onClick={() => playNote(si, fret)}
                style={{ cursor: 'pointer', opacity: active ? 1 : 0.18 }}>
                <circle cx={cx} cy={cy} r={DOT_R} fill={fill} />
                <text x={cx} y={cy + 4} textAnchor="middle"
                  fontSize={name.length > 1 ? 7 : 9} fontWeight="700" fill={fg}>{name}</text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
