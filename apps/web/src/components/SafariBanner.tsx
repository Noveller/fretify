import { useState } from 'react';

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
const isInstalled = (navigator as Navigator & { standalone?: boolean }).standalone === true;

export function SafariBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!isIOS || isSafari || isInstalled || dismissed) return null;

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2 text-xs"
      style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-fret)', color: 'var(--color-on-surface-muted)' }}
    >
      <span>Для установки откройте в <strong style={{ color: 'var(--color-on-surface)' }}>Safari</strong> → Поделиться → На экран Домой</span>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-base leading-none hover:opacity-60 transition-opacity"
        style={{ color: 'var(--color-on-surface-muted)' }}
        aria-label="Закрыть"
      >×</button>
    </div>
  );
}
