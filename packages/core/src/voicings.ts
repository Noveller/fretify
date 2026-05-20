import { ParsedChord } from './parser';
import { indexToNote } from './notes';
import { CURATED_VOICINGS } from './curatedVoicings';

export interface Voicing {
  frets: number[];      // per string, -1 = muted, 0 = open
  startFret: number;    // for display: lowest fret shown (1-based, 0 if open chord)
  fingers: (number | null)[];  // which finger 1-4 or null
}

// Standard tuning: low E to high E in semitones (C=0)
export const STANDARD_TUNING = [4, 9, 2, 7, 11, 4]; // E A D G B E

export function findVoicings(chord: ParsedChord, tuning = STANDARD_TUNING): Voicing[] {
  // Prepend curated voicings for non-slash chords (standard fingerings, may omit 5th)
  const curatedKey = chord.bassNote === chord.rootNote
    ? `${chord.rootNote}_${chord.qualityName}`
    : null;
  const curatedFrets: number[][] = curatedKey ? (CURATED_VOICINGS[curatedKey] ?? []) : [];
  const curatedSet = new Set(curatedFrets.map(f => f.join(',')));

  const { notes, bassNote } = chord;
  const noteSet = new Set(notes);
  // Bass note may be outside chord tones (e.g. Am/G) — include it as valid on any string,
  // but the validation below ensures it only appears on the lowest sounding string.
  const searchNotes = new Set([...notes, bassNote]);
  const strings = tuning.length;
  const MAX_FRET = 12;
  const MAX_SPAN = 4;

  const optionsPerString: number[][] = tuning.map(open => {
    const valid: number[] = [];
    for (let f = 0; f <= MAX_FRET; f++) {
      if (searchNotes.has((open + f) % 12)) valid.push(f);
    }
    valid.push(-1); // mute last — prefer playing over muting
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

      if (results.length < 500) results.push([...current]);
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
    const pressed = frets.filter(f => f > 0);
    const minFret = pressed.length > 0 ? Math.min(...pressed) : 0;
    const maxFret = pressed.length > 0 ? Math.max(...pressed) : 0;
    const span = maxFret - minFret;
    const muted = frets.filter(f => f < 0).length;
    const position = minFret; // prefer lower positions
    // Penalize open strings in position chords (minFret≥3) to prefer closed barre shapes
    const openStrings = frets.filter(f => f === 0).length;
    const openPenalty = minFret >= 3 ? openStrings * 5 : 0;
    const score = position * 2 + span * 4 + muted * 6 + openPenalty;
    return { frets, score, minFret };
  });

  scored.sort((a, b) => a.score - b.score);

  // Pick best voicing per position band to ensure diversity across the neck,
  // then fill remaining slots with overall best scores.
  const BANDS: [number, number][] = [[0, 2], [3, 6], [7, 12]];
  const usedIdx = new Set<number>();
  const selected: typeof scored = [];

  for (const [lo, hi] of BANDS) {
    const idx = scored.findIndex((v, i) => !usedIdx.has(i) && v.minFret >= lo && v.minFret <= hi);
    if (idx >= 0) { selected.push(scored[idx]); usedIdx.add(idx); }
  }
  for (let i = 0; i < scored.length && selected.length < 8; i++) {
    if (!usedIdx.has(i)) { selected.push(scored[i]); usedIdx.add(i); }
  }
  selected.sort((a, b) => a.score - b.score);

  const algorithmicVoicings = selected
    .filter(v => !curatedSet.has(v.frets.join(',')))
    .map(({ frets, minFret }) => {
      const startFret = minFret <= 1 ? 0 : minFret;
      return { frets, startFret, fingers: frets.map(() => null) };
    });

  const curatedVoicings: Voicing[] = curatedFrets.map(frets => {
    const pressed = frets.filter(f => f > 0);
    const minFret = pressed.length > 0 ? Math.min(...pressed) : 0;
    const startFret = minFret <= 1 ? 0 : minFret;
    return { frets, startFret, fingers: frets.map(() => null) };
  });

  return [...curatedVoicings, ...algorithmicVoicings].slice(0, 8);
}

export function noteNameOnString(stringIdx: number, fret: number, tuning = STANDARD_TUNING): string {
  if (fret < 0) return 'x';
  return indexToNote((tuning[stringIdx] + fret) % 12);
}
