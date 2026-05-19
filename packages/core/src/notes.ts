export const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;
export type NoteName = typeof NOTE_NAMES[number];

const ENHARMONICS: Record<string, string> = {
  Db:'C#', Eb:'D#', Fb:'E', Gb:'F#', Ab:'G#', Bb:'A#', Cb:'B', 'E#':'F', 'B#':'C',
};

export function noteToIndex(note: string): number {
  const n = ENHARMONICS[note] ?? note;
  const idx = (NOTE_NAMES as readonly string[]).indexOf(n);
  if (idx === -1) throw new Error(`Unknown note: ${note}`);
  return idx;
}

export function indexToNote(idx: number): NoteName {
  return NOTE_NAMES[((idx % 12) + 12) % 12];
}
