export type DrumTrack = 'kick' | 'snare' | 'hihat' | 'openhat' | 'clap';
export const DRUM_TRACKS: DrumTrack[] = ['kick', 'snare', 'hihat', 'openhat', 'clap'];
export const STEPS = 16;

const LOOKAHEAD = 0.1;
const TICK_MS   = 25;

let audioCtx:   AudioContext | null = null;
let compressor: DynamicsCompressorNode | null = null;
let timerID:    ReturnType<typeof setTimeout> | null = null;
let nextStepTime = 0;
let stepIndex    = 0;
let running      = false;

const state = {
  bpm:     120,
  pattern: Object.fromEntries(DRUM_TRACKS.map(t => [t, new Array<boolean>(STEPS).fill(false)])) as Record<DrumTrack, boolean[]>,
  volumes: { kick: 0.9, snare: 0.75, hihat: 0.38, openhat: 0.32, clap: 0.65 } as Record<DrumTrack, number>,
  onStep:  null as ((step: number) => void) | null,
};

function ac(): AudioContext {
  if (!audioCtx) {
    audioCtx  = new AudioContext();
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -8;
    compressor.ratio.value     = 4;
    compressor.connect(audioCtx.destination);
  }
  return audioCtx;
}

function out(): DynamicsCompressorNode {
  ac();
  return compressor!;
}

// ── Synthesis ────────────────────────────────────────────────────────

function playKick(ctx: AudioContext, t: number, vol: number) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.12);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  osc.connect(gain); gain.connect(out());
  osc.start(t); osc.stop(t + 0.5);
}

function playSnare(ctx: AudioContext, t: number, vol: number) {
  // Noise crack
  const len  = Math.round(ctx.sampleRate * 0.18);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const hp   = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 900;
  const ng   = ctx.createGain();
  ng.gain.setValueAtTime(vol * 0.75, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  noise.connect(hp); hp.connect(ng); ng.connect(out());
  noise.start(t); noise.stop(t + 0.2);

  // Body tone
  const osc  = ctx.createOscillator();
  const og   = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(195, t);
  osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);
  og.gain.setValueAtTime(vol * 0.35, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(og); og.connect(out());
  osc.start(t); osc.stop(t + 0.15);
}

function playHiHat(ctx: AudioContext, t: number, vol: number, open = false) {
  const dur  = open ? 0.28 : 0.045;
  const len  = Math.round(ctx.sampleRate * (dur + 0.02));
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src  = ctx.createBufferSource();
  src.buffer = buf;
  const hp   = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 7200;
  const bp   = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = 10000; bp.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(hp); hp.connect(bp); bp.connect(gain); gain.connect(out());
  src.start(t); src.stop(t + dur + 0.01);
}

function playClap(ctx: AudioContext, t: number, vol: number) {
  for (let i = 0; i < 3; i++) {
    const offset = i * 0.012;
    const len    = Math.round(ctx.sampleRate * 0.06);
    const buf    = ctx.createBuffer(1, len, ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let j = 0; j < len; j++) data[j] = Math.random() * 2 - 1;
    const src  = ctx.createBufferSource();
    src.buffer = buf;
    const bp   = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = 0.6;
    const gain = ctx.createGain();
    const att  = t + offset;
    gain.gain.setValueAtTime(vol * (i === 1 ? 0.9 : 0.5), att);
    gain.gain.exponentialRampToValueAtTime(0.001, att + 0.1);
    src.connect(bp); bp.connect(gain); gain.connect(out());
    src.start(att); src.stop(att + 0.12);
  }
}

function scheduleDrum(ctx: AudioContext, track: DrumTrack, t: number) {
  const vol = state.volumes[track];
  switch (track) {
    case 'kick':    playKick(ctx, t, vol);          break;
    case 'snare':   playSnare(ctx, t, vol);         break;
    case 'hihat':   playHiHat(ctx, t, vol, false);  break;
    case 'openhat': playHiHat(ctx, t, vol, true);   break;
    case 'clap':    playClap(ctx, t, vol);           break;
  }
}

// ── Scheduler ───────────────────────────────────────────────────────

function tick() {
  if (!running) return;
  const ctx_   = ac();
  const stepDur = 60 / state.bpm / 4; // 16th note

  while (nextStepTime < ctx_.currentTime + LOOKAHEAD) {
    for (const track of DRUM_TRACKS) {
      if (state.pattern[track][stepIndex]) scheduleDrum(ctx_, track, nextStepTime);
    }
    const delay = Math.max(0, (nextStepTime - ctx_.currentTime) * 1000);
    const step  = stepIndex;
    setTimeout(() => state.onStep?.(step), delay);

    nextStepTime += stepDur;
    stepIndex = (stepIndex + 1) % STEPS;
  }
  timerID = setTimeout(tick, TICK_MS);
}

// ── Public API ──────────────────────────────────────────────────────

export function drumMachineStart(): void {
  const ctx_ = ac();
  const doStart = () => {
    if (running) return;
    stepIndex    = 0;
    nextStepTime = ctx_.currentTime + 0.05;
    running      = true;
    tick();
  };
  ctx_.state === 'suspended' ? ctx_.resume().then(doStart) : doStart();
}

export function drumMachineStop(): void {
  running = false;
  if (timerID !== null) { clearTimeout(timerID); timerID = null; }
}

export function drumMachineSetBPM(bpm: number)                          { state.bpm = bpm; }
export function drumMachineSetStep(t: DrumTrack, s: number, on: boolean){ state.pattern[t][s] = on; }
export function drumMachineSetCallback(cb: ((step: number) => void) | null) { state.onStep = cb; }

export function drumMachineSetPattern(p: Partial<Record<DrumTrack, boolean[]>>) {
  for (const track of DRUM_TRACKS) {
    state.pattern[track] = p[track] ? [...p[track]!] : new Array<boolean>(STEPS).fill(false);
  }
}

export function drumMachineGetPattern(): Record<DrumTrack, boolean[]> {
  return Object.fromEntries(DRUM_TRACKS.map(t => [t, [...state.pattern[t]]])) as Record<DrumTrack, boolean[]>;
}
