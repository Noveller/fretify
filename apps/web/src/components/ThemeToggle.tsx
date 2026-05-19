import { useTheme } from '../context/ThemeContext';

type Theme = 'light' | 'dark' | 'vintage';

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'vintage', label: 'Vintage' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <select
      value={theme}
      onChange={e => setTheme(e.target.value as Theme)}
      className="bg-[var(--color-surface-2)] text-[var(--color-on-surface)] border border-[var(--color-fret)] rounded-md px-3 py-1.5 text-sm cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
    >
      {THEMES.map(t => (
        <option key={t.value} value={t.value}>{t.label}</option>
      ))}
    </select>
  );
}
