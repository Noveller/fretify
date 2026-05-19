export interface ChordFormula {
  name: string;
  intervals: number[]; // semitones from root
}

// Order matters: longer/more specific patterns first
export const CHORD_FORMULAS: Array<{ pattern: RegExp; formula: ChordFormula }> = [
  { pattern: /^(maj13|M13)/,   formula: { name:'maj13',  intervals:[0,4,7,11,14,21] } },
  { pattern: /^(maj11|M11)/,   formula: { name:'maj11',  intervals:[0,4,7,11,14,17] } },
  { pattern: /^(maj9|M9)/,     formula: { name:'maj9',   intervals:[0,4,7,11,14] } },
  { pattern: /^(maj7|M7|Δ)/,  formula: { name:'maj7',   intervals:[0,4,7,11] } },
  { pattern: /^(m13|min13)/,   formula: { name:'m13',    intervals:[0,3,7,10,14,21] } },
  { pattern: /^(m11|min11)/,   formula: { name:'m11',    intervals:[0,3,7,10,14,17] } },
  { pattern: /^(m9|min9)/,     formula: { name:'m9',     intervals:[0,3,7,10,14] } },
  { pattern: /^(m7b5|m7-5|ø)/, formula: { name:'m7b5',  intervals:[0,3,6,10] } },
  { pattern: /^(m7|min7)/,     formula: { name:'m7',     intervals:[0,3,7,10] } },
  { pattern: /^(m6|min6)/,     formula: { name:'m6',     intervals:[0,3,7,9] } },
  { pattern: /^(m|min)/,       formula: { name:'m',      intervals:[0,3,7] } },
  { pattern: /^(dim7|°7)/,     formula: { name:'dim7',   intervals:[0,3,6,9] } },
  { pattern: /^(dim|°)/,       formula: { name:'dim',    intervals:[0,3,6] } },
  { pattern: /^(aug7|\+7)/,    formula: { name:'aug7',   intervals:[0,4,8,10] } },
  { pattern: /^(aug|\+)/,      formula: { name:'aug',    intervals:[0,4,8] } },
  { pattern: /^(13)/,          formula: { name:'13',     intervals:[0,4,7,10,14,21] } },
  { pattern: /^(11)/,          formula: { name:'11',     intervals:[0,4,7,10,14,17] } },
  { pattern: /^(9)/,           formula: { name:'9',      intervals:[0,4,7,10,14] } },
  { pattern: /^(7sus4)/,       formula: { name:'7sus4',  intervals:[0,5,7,10] } },
  { pattern: /^(7sus2)/,       formula: { name:'7sus2',  intervals:[0,2,7,10] } },
  { pattern: /^(7)/,           formula: { name:'7',      intervals:[0,4,7,10] } },
  { pattern: /^(6\/9|69)/,     formula: { name:'6/9',    intervals:[0,4,7,9,14] } },
  { pattern: /^(6)/,           formula: { name:'6',      intervals:[0,4,7,9] } },
  { pattern: /^(5)/,           formula: { name:'5',      intervals:[0,7] } },
  { pattern: /^(sus4|sus)/,    formula: { name:'sus4',   intervals:[0,5,7] } },
  { pattern: /^(sus2)/,        formula: { name:'sus2',   intervals:[0,2,7] } },
  { pattern: /^(add9|add2)/,   formula: { name:'add9',   intervals:[0,2,4,7] } },
  { pattern: /^(add11|add4)/,  formula: { name:'add11',  intervals:[0,4,5,7] } },
  { pattern: /^()/,            formula: { name:'maj',    intervals:[0,4,7] } },
];
