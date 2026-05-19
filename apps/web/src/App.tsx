import { useState } from 'react';
import { parseChord, findVoicings, type ParsedChord, type Voicing } from '@fretify/core';
import { ChordBuilder } from './components/ChordBuilder';
import { ChordDiagram } from './components/ChordDiagram';
import { ScaleView } from './components/ScaleView';
import { Metronome } from './components/Metronome';
import { ThemeToggle } from './components/ThemeToggle';

type Tab = 'chords' | 'scales' | 'metronome';

const TAB_LABELS: Record<Tab, string> = {
  chords:    'Аккорды',
  scales:    'Гаммы',
  metronome: 'Метроном',
};

export function App() {
  const [tab, setTab] = useState<Tab>('chords');
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
        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
          fretify
        </span>
        <div className="flex items-center gap-4">
          <nav className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            {(['chords', 'scales', 'metronome'] as Tab[]).map(t => (
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
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-12 gap-10">
        {tab === 'chords' && (
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

        {tab === 'scales' && <ScaleView />}

        {tab === 'metronome' && <Metronome />}
      </main>
    </div>
  );
}
