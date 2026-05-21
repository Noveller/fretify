import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../lib/AuthContext';

interface Props {
  onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuthContext();
  const [mode, setMode]       = useState<'signin' | 'signup'>('signin');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-fret)' }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {mode === 'signin' ? t('common.signIn') : t('common.signUp')}
          </h2>
          <button onClick={onClose} className="text-xl leading-none hover:opacity-60"
            style={{ color: 'var(--color-on-surface-muted)' }}>×</button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="text-4xl">📬</div>
            <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
              {t('common.confirmationSent')} <strong>{email}</strong>
            </p>
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}>
              {t('common.understood')}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              type="email" placeholder={t('common.email')} value={email} required
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)',
                border: '1px solid var(--color-fret)' }}
            />
            <input
              type="password" placeholder={t('common.password')} value={password} required minLength={6}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)',
                border: '1px solid var(--color-fret)' }}
            />

            {error && (
              <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}>
              {loading ? '...' : mode === 'signin' ? t('common.signIn') : t('common.signUp')}
            </button>

            <button type="button"
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className="text-xs text-center hover:opacity-80"
              style={{ color: 'var(--color-on-surface-muted)' }}>
              {mode === 'signin' ? t('common.noAccount') : t('common.hasAccount')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
