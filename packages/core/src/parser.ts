import { noteToIndex } from './notes';
import { CHORD_FORMULAS } from './chords';

export interface ParsedChord {
  input: string;
  rootNote: number;      // 0-11
  notes: number[];       // 0-11 each, all chord tones
  bassNote: number;      // 0-11, often same as rootNote
  qualityName: string;
  displayName: string;
}

export function parseChord(input: string): ParsedChord {
  const str = input.trim();

  // Extract bass note from /X at the end
  let main = str;
  let bassNote: number | null = null;
  const slashIdx = str.lastIndexOf('/');
  if (slashIdx > 0) {
    const bassStr = str.slice(slashIdx + 1);
    try {
      bassNote = noteToIndex(bassStr);
      main = str.slice(0, slashIdx);
    } catch {
      // not a valid note, ignore
    }
  }

  // Parse root note (letter + optional # or b)
  const rootMatch = main.match(/^([A-G][#b]?)/);
  if (!rootMatch) throw new Error(`Cannot parse chord: "${input}"`);
  const rootStr = rootMatch[1];
  const rootNote = noteToIndex(rootStr);
  let quality = main.slice(rootStr.length);

  // Match chord quality
  let intervals = [0, 4, 7];
  let qualityName = 'maj';
  for (const { pattern, formula } of CHORD_FORMULAS) {
    if (pattern.test(quality)) {
      intervals = formula.intervals;
      qualityName = formula.name;
      break;
    }
  }

  // Convert intervals to notes (mod 12, deduplicated)
  const notesSet = new Set(intervals.map(i => (rootNote + i) % 12));
  const notes = Array.from(notesSet);

  const resolvedBass = bassNote ?? rootNote;

  return {
    input: str,
    rootNote,
    notes,
    bassNote: resolvedBass,
    qualityName,
    displayName: str,
  };
}
