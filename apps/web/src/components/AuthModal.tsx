import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../lib/AuthContext';

interface Props {
  onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuthContext();
  const [mode, setMode]         = useState<'signin' | 'signup'>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const downOnBackdrop          = useRef(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    if (mode === 'signup') { setDone(true); return; }
    onClose();
  }

  function switchMode(m: 'signin' | 'signup') {
    setMode(m);
    setError(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onMouseDown={e => { downOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={e => { if (e.target === e.currentTarget && downOnBackdrop.current) onClose(); }}
    >
      <div
        className="w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-fret)' }}
      >
        {/* Brand bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <span className="text-base font-bold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
            fretify
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-lg leading-none transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-on-surface-muted)', backgroundColor: 'var(--color-surface-2)' }}
          >
            ×
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 px-5 pb-8 pt-4 text-center">
            <div className="text-5xl">📬</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-muted)' }}>
              {t('common.confirmationSent')}<br />
              <strong style={{ color: 'var(--color-on-surface)' }}>{email}</strong>
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
            >
              {t('common.understood')}
            </button>
          </div>
        ) : (
          <>
            {/* Tab toggle */}
            <div className="flex mx-5 rounded-xl overflow-hidden mb-5" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              {(['signin', 'signup'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className="flex-1 py-2 text-sm font-semibold transition-all"
                  style={mode === m
                    ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderRadius: '0.6rem' }
                    : { color: 'var(--color-on-surface-muted)' }
                  }
                >
                  {m === 'signin' ? t('common.signIn') : t('common.signUp')}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3 px-5 pb-6">
              <input
                type="email"
                placeholder={t('common.email')}
                value={email}
                required
                autoComplete="email"
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-fret)',
                }}
              />
              <input
                type="password"
                placeholder={t('common.password')}
                value={password}
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-fret)',
                }}
              />

              {error && (
                <p className="text-xs px-1" style={{ color: '#ef4444' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-40 mt-1"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
              >
                {loading ? '...' : mode === 'signin' ? t('common.signIn') : t('common.signUp')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
