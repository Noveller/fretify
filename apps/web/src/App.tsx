import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { parseChord, findVoicings, type ParsedChord, type Voicing } from '@fretify/core';
import { ChordBuilder } from './components/ChordBuilder';
import { ChordDiagram } from './components/ChordDiagram';
import { ScaleView } from './components/ScaleView';
import { Metronome } from './components/Metronome';
import { LessonsView } from './components/LessonsView';
import { DrumMachine } from './components/DrumMachine';
import { AboutView } from './components/AboutView';
import { ThemeToggle } from './components/ThemeToggle';

const TABS: { to: string; label: string }[] = [
  { to: '/chords',    label: 'Аккорды'  },
  { to: '/scales',    label: 'Гаммы'    },
  { to: '/metronome', label: 'Метроном' },
  { to: '/drums',     label: 'Драм'     },
  { to: '/lessons',   label: 'Уроки'   },
];

function ChordsPage() {
  const [chord, setChord]               = useState<ParsedChord | null>(null);
  const [voicings, setVoicings]         = useState<Voicing[]>([]);
  const [selectedVoicing, setSelected]  = useState(0);
  const [error, setError]               = useState<string | null>(null);

  function handleClear() { setChord(null); setVoicings([]); setError(null); }

  function handleChord(input: string) {
    try {
      const parsed = parseChord(input);
      setChord(parsed);
      setVoicings(findVoicings(parsed));
      setSelected(0);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setChord(null);
      setVoicings([]);
    }
  }

  return (
    <>
      <div className="w-full max-w-2xl">
        <ChordBuilder onSubmit={handleChord} onClear={handleClear} />
        {error && <p className="mt-3 text-sm" style={{ color: 'var(--color-dot-root)' }}>{error}</p>}
      </div>

      {chord && (
        <ChordDiagram
          chord={chord}
          voicings={voicings}
          selectedIdx={selectedVoicing}
          onSelectVoicing={setSelected}
        />
      )}

      {!chord && !error && (
        <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
          Выберите ноту и тип аккорда выше
        </p>
      )}
    </>
  );
}

export function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--color-fret)' }}>
        <NavLink to="/" className="text-xl font-bold tracking-tight transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-on-surface)' }}>
          fretify
        </NavLink>

        <div className="flex items-center gap-4">
          <nav className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            {TABS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
                    : { color: 'var(--color-on-surface-muted)' }
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/about"
            className="text-sm transition-all hover:opacity-80"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-accent)' : 'var(--color-on-surface-muted)',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            О проекте
          </NavLink>

          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-12 gap-10">
        <Routes>
          <Route path="/"          element={<Navigate to="/chords" replace />} />
          <Route path="/chords"    element={<ChordsPage />} />
          <Route path="/scales"    element={<ScaleView />} />
          <Route path="/metronome" element={<Metronome />} />
          <Route path="/drums"     element={<DrumMachine />} />
          <Route path="/lessons"   element={<LessonsView />} />
          <Route path="/about"     element={<AboutView />} />
        </Routes>
      </main>
    </div>
  );
}
