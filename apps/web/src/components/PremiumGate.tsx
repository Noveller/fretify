import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../lib/AuthContext';
import { AuthModal } from './AuthModal';

interface Props {
  children: React.ReactNode;
  feature?: string; // short description shown on the gate
}

export function PremiumGate({ children, feature }: Props) {
  const { t } = useTranslation();
  const { isPremium, loading } = useAuthContext();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) return null;
  if (isPremium) return <>{children}</>;

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <div className="w-full flex flex-col items-center justify-center gap-6 py-16 text-center px-4">
        <div className="text-5xl">🔒</div>

        <div>
          <p className="text-lg font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
            {t('common.premiumFeature')}
          </p>
          {feature && (
            <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
              {feature}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => setShowAuth(true)}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}>
            {t('common.signInToAccess')}
          </button>
          <p className="text-xs" style={{ color: 'var(--color-on-surface-muted)' }}>
            {t('common.signInHint')}
          </p>
        </div>
      </div>
    </>
  );
}
