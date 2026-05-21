import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../lib/AuthContext';
import { AuthModal } from './AuthModal';

export function PricingView() {
  const { t } = useTranslation();
  const { user, isPremium } = useAuthContext();
  const [showAuth, setShowAuth]           = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleSubscribe() {
    if (!user) { setShowAuth(true); return; }
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/paddle-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const { url } = await res.json() as { url?: string };
      if (url) window.location.href = url;
    } finally {
      setCheckoutLoading(false);
    }
  }

  const freeFeatures = [
    'Chord diagrams in all keys',
    'Barre and open chord shapes',
    'Multiple voicings per chord',
  ];

  const premiumFeatures = [
    'Everything in Free',
    'Scales, modes & fretboard positions',
    'Metronome with custom rhythms',
    'Drum machine — 10 styles',
    'Interactive ear-training lessons',
    '7-day free trial',
  ];

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <div className="w-full max-w-2xl flex flex-col items-center gap-10 py-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            Simple pricing
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="w-full grid sm:grid-cols-2 gap-4">
          {/* Free */}
          <div className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-fret)' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: 'var(--color-on-surface-muted)' }}>Free</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>$0</p>
            </div>
            <ul className="flex flex-col gap-2 flex-1">
              {freeFeatures.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm"
                  style={{ color: 'var(--color-on-surface-muted)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center"
              style={{ border: '1px solid var(--color-fret)', color: 'var(--color-on-surface-muted)' }}>
              Current plan
            </div>
          </div>

          {/* Premium */}
          <div className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: 'var(--color-surface-2)', border: '2px solid var(--color-accent)' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: 'var(--color-accent)' }}>Premium</p>
              <div className="flex items-end gap-1">
                <p className="text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>$3.99</p>
                <p className="text-sm mb-1" style={{ color: 'var(--color-on-surface-muted)' }}>/month</p>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-muted)' }}>
                7-day free trial
              </p>
            </div>
            <ul className="flex flex-col gap-2 flex-1">
              {premiumFeatures.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm"
                  style={{ color: 'var(--color-on-surface)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            {isPremium ? (
              <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}>
                Active ✓
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={checkoutLoading}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}>
                {checkoutLoading ? '...' : user ? t('common.subscribe') : t('common.signInToAccess')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
