import { useState, FormEvent } from 'react';

interface ChordInputProps {
  onSubmit: (chord: string) => void;
}

export function ChordInput({ onSubmit }: ChordInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Введите аккорд: Cmaj7, F#m/C#, G7sus4..."
        className="flex-1 bg-[var(--color-surface-2)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-muted)] border border-[var(--color-fret)] rounded-lg px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
      <button
        type="submit"
        className="px-5 py-2.5 rounded-lg text-sm font-medium transition"
        style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
      >
        Показать
      </button>
    </form>
  );
}
