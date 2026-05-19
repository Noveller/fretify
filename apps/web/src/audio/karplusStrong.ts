// Karplus-Strong plucked string synthesis via Web Audio API

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// Standard tuning open string frequencies (Hz): E2 A2 D3 G3 B3 E4
const OPEN_FREQ = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];

export function stringFrequency(stringIndex: number, fret: number): number {
  return OPEN_FREQ[stringIndex] * Math.pow(2, fret / 12);
}

function synthNote(
  audioCtx: AudioContext,
  frequency: number,
  startTime: number,
  gain = 0.75,
): void {
  const sr = audioCtx.sampleRate;
  const duration = 3.5;

  // Decay: bass strings sustain longer than treble strings
  const decay = 0.998 - (frequency / sr) * 0.4;

  const bufLen = Math.round(sr / frequency);
  const totalSamples = Math.round(sr * duration);

  const buffer = audioCtx.createBuffer(1, totalSamples, sr);
  const data = buffer.getChannelData(0);

  // Delay line seeded with low-passed white noise for a smooth attack
  const line = new Float32Array(bufLen);
  for (let i = 0; i < bufLen; i++) line[i] = Math.random() * 2 - 1;
  for (let i = 0; i < bufLen; i++) {
    line[i] = 0.5 * (line[i] + line[(i + 1) % bufLen]);
  }

  // Karplus-Strong iteration
  let pos = 0;
  for (let i = 0; i < totalSamples; i++) {
    const next = (pos + 1) % bufLen;
    data[i] = line[pos];
    line[pos] = decay * 0.5 * (line[pos] + line[next]);
    pos = next;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start(startTime);
  source.stop(startTime + duration);
}

async function resume(): Promise<AudioContext> {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  return audioCtx;
}

export async function playChord(frets: number[], strumDelay = 0.07): Promise<void> {
  const audioCtx = await resume();
  const now = audioCtx.currentTime + 0.05;
  frets.forEach((fret, si) => {
    if (fret < 0) return;
    synthNote(audioCtx, stringFrequency(si, fret), now + si * strumDelay);
  });
}

export async function playNote(stringIndex: number, fret: number): Promise<void> {
  if (fret < 0) return;
  const audioCtx = await resume();
  synthNote(audioCtx, stringFrequency(stringIndex, fret), audioCtx.currentTime + 0.02);
}

export async function playNoteSequence(notes: [number, number][], noteDelay = 0.38): Promise<void> {
  const audioCtx = await resume();
  const now = audioCtx.currentTime + 0.05;
  notes.forEach(([si, fret], i) => {
    synthNote(audioCtx, stringFrequency(si, fret), now + i * noteDelay);
  });
}
