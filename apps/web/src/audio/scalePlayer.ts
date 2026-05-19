import { playNoteSequence } from './karplusStrong';

const OPEN_FREQ = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];

// Place root near E2 (MIDI 40) in guitar-friendly range
function rootMidi(rootNote: number): number {
  return 40 + ((rootNote - 4 + 12) % 12);
}

function findPos(midi: number): [number, number] | null {
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  let best: [number, number] | null = null;
  let bestFret = Infinity;
  for (let si = 0; si < 6; si++) {
    const fret = Math.round(12 * Math.log2(freq / OPEN_FREQ[si]));
    if (fret >= 0 && fret <= 12 && fret < bestFret) {
      best = [si, fret];
      bestFret = fret;
    }
  }
  return best;
}

// Returns total playback duration in ms so caller can reset playing state
export async function playScale(rootNote: number, intervals: number[], noteDelay = 0.38): Promise<number> {
  const base = rootMidi(rootNote);
  const notes: [number, number][] = [];
  for (const interval of [...intervals, 12]) {
    const pos = findPos(base + interval);
    if (pos) notes.push(pos);
  }
  await playNoteSequence(notes, noteDelay);
  return notes.length * noteDelay * 1000;
}
