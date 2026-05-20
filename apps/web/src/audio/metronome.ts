export type BeatType  = 'accent' | 'normal' | 'silent';
export type SoundType = 'click' | 'wood' | 'bell';

const LOOKAHEAD  = 0.1;  // seconds to look ahead when scheduling
const TICK_MS    = 25;   // scheduler polling interval

let audioCtx: AudioContext | null = null;
let timerID:  ReturnType<typeof setTimeout> | null = null;
let nextBeatTime = 0;
let beatIndex    = 0;
let running      = false;

const state = {
  bpm:     120 as number,
  pattern: ['accent', 'normal', 'normal', 'normal'] as BeatType[],
  sound:   'click' as SoundType,
  onBeat:  null as ((idx: number) => void) | null,
};

function ac(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

// ── Sound synthesis ──────────────────────────────────────────────────

function playClick(ctx: AudioContext, t: number, accent: boolean) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(accent ? 1600 : 1000, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.025);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(accent ? 0.9 : 0.55, t + 0.001);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
  osc.connect(env); env.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.04);
}

function playWood(ctx: AudioContext, t: number, accent: boolean) {
  const dur  = 0.07;
  const buf  = ctx.createBuffer(1, Math.round(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp  = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = accent ? 1300 : 850; bp.Q.value = 6;
  const env = ctx.createGain();
  env.gain.setValueAtTime(accent ? 3.0 : 2.0, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(bp); bp.connect(env); env.connect(ctx.destination);
  src.start(t); src.stop(t + dur + 0.01);
}

function playBell(ctx: AudioContext, t: number, accent: boolean) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = accent ? 880 : 660;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(accent ? 0.7 : 0.45, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.connect(env); env.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.25);
}

function playBeat(ctx: AudioContext, t: number, type: BeatType) {
  if (type === 'silent') return;
  const accent = type === 'accent';
  if      (state.sound === 'click') playClick(ctx, t, accent);
  else if (state.sound === 'wood')  playWood(ctx, t, accent);
  else                              playBell(ctx, t, accent);
}

// ── Scheduler ────────────────────────────────────────────────────────

function tick() {
  if (!running) return;
  const ctx_ = ac();
  while (nextBeatTime < ctx_.currentTime + LOOKAHEAD) {
    playBeat(ctx_, nextBeatTime, state.pattern[beatIndex]);

    // Sync visual indicator to audio time
    const delay = Math.max(0, (nextBeatTime - ctx_.currentTime) * 1000);
    const idx   = beatIndex;
    setTimeout(() => state.onBeat?.(idx), delay);

    nextBeatTime += 60 / state.bpm;
    beatIndex = (beatIndex + 1) % state.pattern.length;
  }
  timerID = setTimeout(tick, TICK_MS);
}

// ── Public API ───────────────────────────────────────────────────────

export function metronomeStart(): void {
  const ctx_ = ac();
  const doStart = () => {
    if (running) return;
    beatIndex    = 0;
    nextBeatTime = ctx_.currentTime + 0.08;
    running      = true;
    tick();
  };
  ctx_.state === 'suspended' ? ctx_.resume().then(doStart) : doStart();
}

export function metronomeStop(): void {
  running = false;
  if (timerID !== null) { clearTimeout(timerID); timerID = null; }
}

export function metronomeSetBPM(bpm: number)             { state.bpm     = bpm; }
export function metronomeSetSound(sound: SoundType)      { state.sound   = sound; }
export function metronomeSetCallback(cb: ((idx: number) => void) | null) { state.onBeat = cb; }

export function metronomeSetPattern(pattern: BeatType[]): void {
  state.pattern = pattern;
  beatIndex     = beatIndex % pattern.length;
}
