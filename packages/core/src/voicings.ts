import { ParsedChord } from './parser';
import { indexToNote } from './notes';

export interface Voicing {
  frets: number[];      // per string, -1 = muted, 0 = open
  startFret: number;    // for display: lowest fret shown (1-based, 0 if open chord)
  fingers: (number | null)[];  // which finger 1-4 or null
}

// Standard tuning: low E to high E in semitones (C=0)
export const STANDARD_TUNING = [4, 9, 2, 7, 11, 4]; // E A D G B E

export function findVoicings(chord: ParsedChord, tuning = STANDARD_TUNING): Voicing[] {
  const { notes, bassNote } = chord;
  const noteSet = new Set(notes);
  // Bass note may be outside chord tones (e.g. Am/G) — include it as valid on any string,
  // but the validation below ensures it only appears on the lowest sounding string.
  const searchNotes = new Set([...notes, bassNote]);
  const strings = tuning.length;
  const MAX_FRET = 12;
  const MAX_SPAN = 4;

  const optionsPerString: number[][] = tuning.map(open => {
    const valid: number[] = [-1];
    for (let f = 0; f <= MAX_FRET; f++) {
      if (searchNotes.has((open + f) % 12)) valid.push(f);
    }
    return valid;
  });

  const results: number[][] = [];

  function backtrack(si: number, current: number[]) {
    if (si === strings) {
      // Validate: at least 4 non-muted strings
      const active = current.filter(f => f >= 0);
      if (active.length < 4) return;

      // All chord tones present
      const played = new Set(current.map((f, i) => f >= 0 ? (tuning[i] + f) % 12 : null).filter(n => n !== null) as number[]);
      if (!notes.every(n => played.has(n))) return;

      // Bass note on lowest sounding string; other strings must be chord tones only
      const lowestIdx = current.findIndex(f => f >= 0);
      if (lowestIdx >= 0) {
        const lowestNote = (tuning[lowestIdx] + current[lowestIdx]) % 12;
        if (lowestNote !== bassNote) return;
        for (let i = lowestIdx + 1; i < current.length; i++) {
          if (current[i] >= 0 && !noteSet.has((tuning[i] + current[i]) % 12)) return;
        }
      }

      if (results.length < 200) results.push([...current]);
      return;
    }

    for (const fret of optionsPerString[si]) {
      // Span check: non-open frets must be within MAX_SPAN
      if (fret > 0) {
        const pressedSoFar = current.filter(f => f > 0);
        pressedSoFar.push(fret);
        if (pressedSoFar.length > 1) {
          const lo = Math.min(...pressedSoFar);
          const hi = Math.max(...pressedSoFar);
          if (hi - lo > MAX_SPAN) continue;
        }
      }
      current.push(fret);
      backtrack(si + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);

  // Score and sort voicings
  const scored = results.map(frets => {
    const active = frets.filter(f => f >= 0);
    const pressed = frets.filter(f => f > 0);
    const minFret = pressed.length > 0 ? Math.min(...pressed) : 0;
    const maxFret = pressed.length > 0 ? Math.max(...pressed) : 0;
    const span = maxFret - minFret;
    const muted = frets.filter(f => f < 0).length;
    const position = minFret; // prefer lower positions
    const score = position * 10 + span * 3 + muted * 2;
    return { frets, score, minFret };
  });

  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, 6).map(({ frets, minFret }) => {
    const startFret = minFret <= 1 ? 0 : minFret;
    return { frets, startFret, fingers: frets.map(() => null) };
  });
}

export function noteNameOnString(stringIdx: number, fret: number, tuning = STANDARD_TUNING): string {
  if (fret < 0) return 'x';
  return indexToNote((tuning[stringIdx] + fret) % 12);
}
