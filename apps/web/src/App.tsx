import { useState } from 'react';
import { parseChord, findVoicings, type ParsedChord, type Voicing } from '@fretify/core';
import { ChordBuilder } from './components/ChordBuilder';
import { ChordDiagram } from './components/ChordDiagram';
import { ScaleView } from './components/ScaleView';
import { Metronome } from './components/Metronome';
import { LessonsView } from './components/LessonsView';
import { AboutView } from './components/AboutView';
import { ThemeToggle } from './components/ThemeToggle';

type Tab = 'chords' | 'scales' | 'metronome' | 'lessons';

const TAB_LABELS: Record<Tab, string> = {
  chords:    'Аккорды',
  scales:    'Гаммы',
  metronome: 'Метроном',
  lessons:   'Уроки',
};

export function App() {
  const [tab, setTab] = useState<Tab>('chords');
  const [showAbout, setShowAbout] = useState(false);
  const [chord, setChord] = useState<ParsedChord | null>(null);
  const [voicings, setVoicings] = useState<Voicing[]>([]);
  const [selectedVoicing, setSelectedVoicing] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleClear() {
    setChord(null);
    setVoicings([]);
    setError(null);
  }

  function handleChord(input: string) {
    try {
      const parsed = parseChord(input);
      const found = findVoicings(parsed);
      setChord(parsed);
      setVoicings(found);
      setSelectedVoicing(0);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setChord(null);
      setVoicings([]);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-fret)' }}>
        <button
          onClick={() => setShowAbout(false)}
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-on-surface)' }}
        >
          fretify
        </button>
        <div className="flex items-center gap-4">
          {!showAbout && (
            <nav className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              {(['chords', 'scales', 'metronome', 'lessons'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
                  style={
                    tab === t
                      ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
                      : { color: 'var(--color-on-surface-muted)' }
                  }
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </nav>
          )}
          <button
            onClick={() => setShowAbout(v => !v)}
            className="text-sm transition-all hover:opacity-80"
            style={{
              color: showAbout ? 'var(--color-accent)' : 'var(--color-on-surface-muted)',
              fontWeight: showAbout ? 600 : 400,
            }}
          >
            О проекте
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-12 gap-10">
        {showAbout && <AboutView />}

        {!showAbout && tab === 'chords' && (
          <>
            <div className="w-full max-w-2xl">
              <ChordBuilder onSubmit={handleChord} onClear={handleClear} />
              {error && (
                <p className="mt-3 text-sm" style={{ color: 'var(--color-dot-root)' }}>{error}</p>
              )}
            </div>

            {chord && (
              <ChordDiagram
                chord={chord}
                voicings={voicings}
                selectedIdx={selectedVoicing}
                onSelectVoicing={setSelectedVoicing}
              />
            )}

            {!chord && !error && (
              <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
                Выберите ноту и тип аккорда выше
              </p>
            )}
          </>
        )}

        {!showAbout && tab === 'scales' && <ScaleView />}

        {!showAbout && tab === 'metronome' && <Metronome />}

        {!showAbout && tab === 'lessons' && <LessonsView />}
      </main>
    </div>
  );
}
