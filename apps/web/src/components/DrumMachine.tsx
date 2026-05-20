import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  drumMachineStart, drumMachineStop, drumMachineSetBPM,
  drumMachineSetStep, drumMachineSetCallback, drumMachineSetPattern,
  DRUM_TRACKS, STEPS, type DrumTrack,
} from '../audio/drumMachine';

const BPM_MIN = 40;
const BPM_MAX = 220;

const CELL  = 34;
const IGAP  = 5;
const GGAP  = 12;
const LABEL = 62;

const TRACK_LABELS: Record<DrumTrack, string> = {
  kick: 'Kick', snare: 'Snare', hihat: 'Hi-Hat', openhat: 'Open', clap: 'Clap',
};
const TRACK_COLORS: Record<DrumTrack, string> = {
  kick:    '#ef4444',
  snare:   '#f97316',
  hihat:   '#eab308',
  openhat: '#22c55e',
  clap:    '#818cf8',
};

type Pattern = Record<DrumTrack, boolean[]>;

function emptyPattern(): Pattern {
  return Object.fromEntries(DRUM_TRACKS.map(t => [t, new Array<boolean>(STEPS).fill(false)])) as Pattern;
}

const PRESETS: { label: string; pattern: Partial<Record<DrumTrack, boolean[]>> }[] = [
  { label: 'Пусто',    pattern: {} },
  { label: 'Базовый',  pattern: {
    kick:  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(Boolean),
  }},
  { label: 'Рок',      pattern: {
    kick:  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(Boolean),
  }},
  { label: 'Фанк',     pattern: {
    kick:  [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0].map(Boolean),
    snare: [0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0].map(Boolean),
    hihat: [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1].map(Boolean),
    clap:  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0].map(Boolean),
  }},
  { label: 'Хип-хоп',  pattern: {
    kick:  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(Boolean),
    clap:  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
  }},
  { label: 'Трэп',     pattern: {
    kick:  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(Boolean),
    openhat:[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0].map(Boolean),
  }},
  { label: 'Регги',    pattern: {
    kick:  [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0].map(Boolean),
    snare: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0].map(Boolean),
    hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(Boolean),
    openhat:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
  }},
  { label: 'Диско',    pattern: {
    kick:  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(Boolean),
    openhat:[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0].map(Boolean),
  }},
  { label: 'Джаз',     pattern: {
    kick:  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0].map(Boolean),
    hihat: [1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0].map(Boolean),
  }},
  { label: 'Самба',    pattern: {
    kick:  [1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0].map(Boolean),
    snare: [0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0].map(Boolean),
    hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(Boolean),
    clap:  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
  }},
];

const GROUPS = [0, 4, 8, 12];

function Row({ label, renderCell }: {
  label: React.ReactNode;
  renderCell: (step: number) => React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: LABEL, flexShrink: 0 }}>{label}</div>
      <div style={{ display: 'flex' }}>
        {GROUPS.map((g, gi) => (
          <div key={g} style={{ display: 'flex', gap: IGAP, marginLeft: gi === 0 ? 0 : GGAP }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: CELL, flexShrink: 0 }}>
                {renderCell(g + i)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DrumMachine() {
  const { t } = useTranslation();
  const [bpm, setBpm]             = useState(120);
  const [running, setRunning]     = useState(false);
  const [currentStep, setCurrent] = useState<number | null>(null);
  const [pattern, setPattern]     = useState<Pattern>(emptyPattern);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { drumMachineSetBPM(bpm); }, [bpm]);

  useEffect(() => {
    drumMachineSetCallback(step => {
      setCurrent(step);
      if (stepTimer.current) clearTimeout(stepTimer.current);
      stepTimer.current = setTimeout(() => setCurrent(null), 80);
    });
    return () => {
      drumMachineStop();
      drumMachineSetCallback(null);
      if (stepTimer.current) clearTimeout(stepTimer.current);
    };
  }, []);

  function toggleRunning() {
    if (running) { drumMachineStop(); setRunning(false); setCurrent(null); }
    else         { drumMachineStart(); setRunning(true); }
  }

  function toggleStep(track: DrumTrack, step: number) {
    setPattern(prev => {
      const next = { ...prev, [track]: [...prev[track]] };
      next[track][step] = !next[track][step];
      drumMachineSetStep(track, step, next[track][step]);
      return next;
    });
  }

  function applyPreset(p: typeof PRESETS[number]) {
    const next = emptyPattern();
    for (const t of DRUM_TRACKS) if (p.pattern[t]) next[t] = [...p.pattern[t]!];
    setPattern(next);
    drumMachineSetPattern(p.pattern);
  }

  const gridMinW = LABEL + 4 * (4 * CELL + 3 * IGAP) + 3 * GGAP + 24;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">

      {/* Transport card */}
      <div className="rounded-2xl px-6 py-5 flex items-center gap-5"
        style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-fret)' }}>

        {/* BPM badge */}
        <div className="flex flex-col items-center shrink-0 rounded-xl px-4 py-2"
          style={{ backgroundColor: 'var(--color-surface)', minWidth: 72 }}>
          <span className="font-mono font-black leading-none"
            style={{ fontSize: 40, color: 'var(--color-on-surface)' }}>{bpm}</span>
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-on-surface-muted)' }}>BPM</span>
        </div>

        {/* Slider */}
        <input type="range" min={BPM_MIN} max={BPM_MAX} value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          className="flex-1" style={{ accentColor: 'var(--color-accent)' }} />

        {/* Play/Stop */}
        <button onClick={toggleRunning}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={running
            ? { backgroundColor: '#ef4444', color: '#fff', boxShadow: '0 0 16px #ef444466' }
            : { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)',
                boxShadow: '0 0 16px color-mix(in srgb, var(--color-accent) 40%, transparent)' }}>
          <span style={{ fontSize: 16 }}>{running ? '■' : '▶'}</span>
          {running ? t('common.stop') : t('common.start')}
        </button>
      </div>

      {/* Presets row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium uppercase tracking-widest shrink-0"
          style={{ color: 'var(--color-on-surface-muted)' }}>{t('drums.patternLabel')}</span>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)',
              border: '1px solid var(--color-fret)' }}>
            {t(`drums.presets.${p.label}`)}
          </button>
        ))}
      </div>

      {/* Grid card */}
      <div className="rounded-2xl p-5"
        style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-fret)', overflowX: 'auto' }}>
        <div style={{ minWidth: gridMinW }}>

          {/* Step numbers */}
          <Row label={null} renderCell={step => {
            const isCur = currentStep === step;
            return (
              <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isCur ? (
                  <div style={{
                    width: CELL - 4, height: 16, borderRadius: 4,
                    backgroundColor: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-accent-fg)' }}>
                      {step + 1}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: 9, color: 'var(--color-on-surface-muted)', opacity: 0.5 }}>
                    {step + 1}
                  </span>
                )}
              </div>
            );
          }} />

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: 'var(--color-fret)', opacity: 0.4,
            margin: '6px 0 8px', marginLeft: LABEL }} />

          {/* Track rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {DRUM_TRACKS.map((track, ti) => (
              <Row key={track}
                label={
                  <div className="flex items-center gap-1.5">
                    <div style={{ width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: TRACK_COLORS[track],
                      boxShadow: `0 0 6px ${TRACK_COLORS[track]}99` }} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
                      color: 'var(--color-on-surface-muted)', textTransform: 'uppercase' }}>
                      {TRACK_LABELS[track]}
                    </span>
                  </div>
                }
                renderCell={step => {
                  const on      = pattern[track][step];
                  const isCur   = currentStep === step;
                  const playing = isCur && running;
                  const color   = TRACK_COLORS[track];
                  return (
                    <button
                      onClick={() => toggleStep(track, step)}
                      title={`${TRACK_LABELS[track]} шаг ${step + 1}`}
                      style={{
                        width: CELL, height: CELL,
                        borderRadius: 6,
                        border: on
                          ? `2px solid ${color}`
                          : isCur
                          ? '2px solid var(--color-accent)'
                          : '1.5px solid var(--color-fret)',
                        cursor: 'pointer',
                        transition: 'all 0.06s',
                        backgroundColor: on
                          ? playing
                            ? `color-mix(in srgb, ${color} 75%, white)`
                            : color
                          : isCur
                          ? 'color-mix(in srgb, var(--color-accent) 12%, var(--color-surface))'
                          : 'var(--color-surface)',
                        boxShadow: on && playing
                          ? `0 0 10px ${color}88, inset 0 1px 0 rgba(255,255,255,0.2)`
                          : on
                          ? `0 0 6px ${color}44`
                          : 'none',
                        transform: playing && on ? 'scale(1.08)' : 'scale(1)',
                      }}
                    />
                  );
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: 'var(--color-fret)', opacity: 0.4,
            margin: '8px 0 4px', marginLeft: LABEL }} />

          {/* Beat labels */}
          <Row label={null} renderCell={step => (
            step % 4 === 0
              ? <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: 'var(--color-on-surface-muted)',
                    opacity: 0.6,
                  }}>
                    {step / 4 + 1}
                  </span>
                </div>
              : null
          )} />
        </div>
      </div>
    </div>
  );
}
