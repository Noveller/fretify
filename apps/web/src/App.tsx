import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { parseChord, findVoicings, type ParsedChord, type Voicing } from '@fretify/core';
import { ChordBuilder } from './components/ChordBuilder';
import { ChordDiagram } from './components/ChordDiagram';
import { ScaleView } from './components/ScaleView';
import { Metronome } from './components/Metronome';
import { LessonsView } from './components/LessonsView';
import { DrumMachine } from './components/DrumMachine';
import { AboutView } from './components/AboutView';
import { ThemeToggle } from './components/ThemeToggle';
import { setLanguage, LANGUAGES } from './i18n';

const BASE_URL = 'https://fretify.app';

function PageHelmet() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const title = pathname !== '/'
    ? t(`seo.${pathname}.title`, { defaultValue: t('seo.defaultTitle') })
    : t('seo.defaultTitle');
  const desc = pathname !== '/'
    ? t(`seo.${pathname}.desc`, { defaultValue: t('seo.defaultDesc') })
    : t('seo.defaultDesc');
  const url = `${BASE_URL}${pathname}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description"         content={desc} />
      <link rel="canonical"            href={url} />
      <meta property="og:title"        content={title} />
      <meta property="og:description"  content={desc} />
      <meta property="og:url"          content={url} />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}

function ChordsPage() {
  const { t } = useTranslation();
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
          {t('chords.selectHint')}
        </p>
      )}
    </>
  );
}

export function App() {
  const { t, i18n } = useTranslation();

  const TABS = [
    { to: '/chords',    label: t('nav.chords')    },
    { to: '/scales',    label: t('nav.scales')    },
    { to: '/metronome', label: t('nav.metronome') },
    { to: '/drums',     label: t('nav.drums')     },
    { to: '/lessons',   label: t('nav.lessons')   },
  ];

  const ALL_TABS = [...TABS, { to: '/about', label: t('nav.about') }];

  return (
    <>
    <PageHelmet />
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b"
        style={{ borderColor: 'var(--color-fret)' }}>
        <NavLink to="/" className="text-xl font-bold tracking-tight transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-on-surface)' }}>
          fretify
        </NavLink>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop nav */}
          <nav className="hidden sm:flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--color-surface-2)' }}>
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
            className="hidden sm:block text-sm transition-all hover:opacity-80"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-accent)' : 'var(--color-on-surface-muted)',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {t('nav.about')}
          </NavLink>

          {/* Language switcher */}
          <div className="flex gap-0.5 rounded-lg p-0.5" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className="px-2 py-1 rounded text-xs font-medium transition-all"
                style={
                  i18n.language === code
                    ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
                    : { color: 'var(--color-on-surface-muted)', backgroundColor: 'transparent' }
                }
              >
                {label}
              </button>
            ))}
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-3 sm:px-4 pt-6 sm:pt-10 pb-24 sm:pb-12 gap-6 sm:gap-10">
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

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 flex border-t z-50"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-fret)' }}>
        {ALL_TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex-1 py-2 text-center text-xs font-medium transition-colors leading-tight"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-accent)' : 'var(--color-on-surface-muted)',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
    </>
  );
}
