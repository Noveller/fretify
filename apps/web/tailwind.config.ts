import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color tokens used via CSS variables
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-muted': 'var(--color-on-surface-muted)',
        accent: 'var(--color-accent)',
        'accent-fg': 'var(--color-accent-fg)',
        string: 'var(--color-string)',
        fret: 'var(--color-fret)',
        dot: 'var(--color-dot)',
        'dot-fg': 'var(--color-dot-fg)',
        'dot-root': 'var(--color-dot-root)',
        'dot-root-fg': 'var(--color-dot-root-fg)',
      },
    },
  },
  plugins: [],
} satisfies Config;
