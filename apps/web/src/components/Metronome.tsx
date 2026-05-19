import { useState, useEffect, useRef, useCallback } from 'react';
import {
  metronomeStart, metronomeStop,
  metronomeSetBPM, metronomeSetSound, metronomeSetPattern, metronomeSetCallback,
  type BeatType, type SoundType,
} from '../audio/metronome';

const BPM_MIN = 40;
const BPM_MAX = 240;
const TAP_WINDOW = 3000; // ms — discard taps older than this

const TIME_SIGS: { label: string; pattern: BeatType[] }[] = [
  { label: '2/4', pattern: ['accent', 'normal'] },
  { label: '3/4', pattern: ['accent', 'normal', 'normal'] },
  { label: '4/4', pattern: ['accent', 'normal', 'normal', 'normal'] },
  { label: '5/4', pattern: ['accent', 'normal', 'normal', 'normal', 'normal'] },
  { label: '6/8', pattern: ['accent', 'normal', 'normal', 'accent', 'normal', 'normal'] },
];

const SOUNDS: { value: SoundType; label: string }[] = [
  { value: 'click', label: 'Клик' },
  { value: 'wood',  label: 'Дерево' },
  { value: 'bell',  label: 'Звонок' },
];

const BEAT_CYCLE: BeatType[] = ['accent', 'normal', 'silent'];

function nextBeatType(t: BeatType): BeatType {
  return BEAT_CYCLE[(BEAT_CYCLE.indexOf(t) + 1) % BEAT_CYCLE.length];
}

function beatColor(t: BeatType, active: boolean): string {
  if (active) return 'var(--color-accent)';
  if (t === 'accent') return 'var(--color-dot-root)';
  if (t === 'normal') return 'var(--color-dot)';
  return 'var(--color-surface-2)';
}

function beatFg(t: BeatType, active: boolean): string {
  if (active) return 'var(--color-accent-fg)';
  if (t === 'accent') return 'var(--color-dot-root-fg)';
  if (t === 'normal') return 'var(--color-dot-fg)';
  return 'var(--color-on-surface-muted)';
}

export function Metronome() {
  const [bpm, setBpm]           = useState(120);
  const [sound, setSound]       = useState<SoundType>('click');
  const [pattern, setPattern]   = useState<BeatType[]>(['accent', 'normal', 'normal', 'normal']);
  const [running, setRunning]   = useState(false);
  const [activeBeat, setActive] = useState<number | null>(null);

  const tapsRef    = useRef<number[]>([]);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep engine in sync
  useEffect(() => { metronomeSetBPM(bpm); }, [bpm]);
  useEffect(() => { metronomeSetSound(sound); }, [sound]);
  useEffect(() => { metronomeSetPattern(pattern); }, [pattern]);

  useEffect(() => {
    metronomeSetCallback((idx) => {
      setActive(idx);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setActive(null), 120);
    });
    return () => {
      metronomeStop();
      metronomeSetCallback(null);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  function toggleRunning() {
    if (running) {
      metronomeStop();
      setRunning(false);
      setActive(null);
    } else {
      metronomeStart();
      setRunning(true);
    }
  }

  const handleTap = useCallback(() => {
    const now = Date.now();
    tapsRef.current = tapsRef.current.filter(t => now - t < TAP_WINDOW);
    tapsRef.current.push(now);
    if (tapsRef.current.length >= 2) {
      const intervals = tapsRef.current.slice(1).map((t, i) => t - tapsRef.current[i]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / avg);
      const clamped = Math.min(BPM_MAX, Math.max(BPM_MIN, newBpm));
      setBpm(clamped);
    }
  }, []);

  function applyTimeSig(p: BeatType[]) {
    setPattern(p);
    setActive(null);
  }

  function toggleBeat(i: number) {
    setPattern(prev => {
      const next = [...prev];
      next[i] = nextBeatType(next[i]);
      return next;
    });
  }

  function addBeat() {
    setPattern(prev => [...prev, 'normal']);
  }

  function removeBeat() {
    if (pattern.length <= 1) return;
    setPattern(prev => prev.slice(0, -1));
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">

      {/* BPM display + slider */}
      <div className="rounded-xl p-6 flex flex-col items-center gap-4"
        style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <div className="flex items-end gap-2">
          <span className="font-mono font-bold leading-none"
            style={{ fontSize: 72, color: 'var(--color-on-surface)' }}>{bpm}</span>
          <span className="text-sm mb-3" style={{ color: 'var(--color-on-surface-muted)' }}>BPM</span>
        </div>

        <input
          type="range" min={BPM_MIN} max={BPM_MAX} value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)]"
          style={{ accentColor: 'var(--color-accent)' }}
        />

        <div className="flex items-center justify-between w-full text-xs"
          style={{ color: 'var(--color-on-surface-muted)' }}>
          <span>{BPM_MIN}</span>
          <button
            onClick={handleTap}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 active:scale-95"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)',
              border: '1px solid var(--color-fret)' }}
          >Тап</button>
          <span>{BPM_MAX}</span>
        </div>
      </div>

      {/* Sound selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-on-surface-muted)' }}>Звук</span>
        <div className="flex gap-2">
          {SOUNDS.map(s => (
            <button key={s.value} onClick={() => setSound(s.value)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={
                sound === s.value
                  ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
                  : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)' }
              }
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* Time signature presets */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-on-surface-muted)' }}>Размер</span>
        <div className="flex gap-2 flex-wrap">
          {TIME_SIGS.map(ts => (
            <button key={ts.label} onClick={() => applyTimeSig(ts.pattern)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)' }}
            >{ts.label}</button>
          ))}
        </div>
      </div>

      {/* Beat pattern editor */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-on-surface-muted)' }}>Ритмический рисунок</span>

        <div className="flex gap-2 flex-wrap">
          {pattern.map((beat, i) => {
            const active = activeBeat === i;
            return (
              <button key={i} onClick={() => toggleBeat(i)}
                className="flex flex-col items-center justify-center rounded-xl font-bold transition-all"
                style={{
                  width: 52, height: 52,
                  backgroundColor: beatColor(beat, active),
                  color: beatFg(beat, active),
                  transform: active ? 'scale(1.18)' : 'scale(1)',
                  border: beat === 'silent' ? '2px dashed var(--color-fret)' : 'none',
                  boxShadow: active ? '0 0 0 3px var(--color-accent)' : 'none',
                }}
              >
                <span style={{ fontSize: 18 }}>{i + 1}</span>
                <span style={{ fontSize: 8, opacity: 0.75, letterSpacing: '0.03em', marginTop: 1 }}>
                  {beat === 'accent' ? 'АКЦЕНТ' : beat === 'normal' ? 'УДАР' : 'ПАУЗА'}
                </span>
              </button>
            );
          })}

          {/* Add / remove buttons */}
          <div className="flex flex-col gap-1">
            <button onClick={addBeat}
              className="flex items-center justify-center rounded-lg text-lg font-bold transition-all hover:opacity-80"
              style={{ width: 28, height: 24, backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-on-surface)' }}>+</button>
            <button onClick={removeBeat} disabled={pattern.length <= 1}
              className="flex items-center justify-center rounded-lg text-lg font-bold transition-all hover:opacity-80 disabled:opacity-30"
              style={{ width: 28, height: 24, backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-on-surface)' }}>−</button>
          </div>
        </div>

        <p className="text-xs" style={{ color: 'var(--color-on-surface-muted)' }}>
          Нажмите на долю чтобы изменить: акцент → удар → пауза
        </p>
      </div>

      {/* Start / Stop */}
      <button
        onClick={toggleRunning}
        className="w-full py-4 rounded-xl text-base font-bold transition-all hover:opacity-90 active:scale-98"
        style={
          running
            ? { backgroundColor: 'var(--color-dot-root)', color: 'var(--color-dot-root-fg)' }
            : { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
        }
      >
        {running ? 'Стоп' : 'Старт'}
      </button>
    </div>
  );
}
