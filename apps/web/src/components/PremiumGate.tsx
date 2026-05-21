import { useState } from 'react';
import { useAuthContext } from '../lib/AuthContext';
import { AuthModal } from './AuthModal';

interface Props {
  children: React.ReactNode;
  feature?: string; // short description shown on the gate
}

export function PremiumGate({ children, feature }: Props) {
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
            Премиум функция
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
            Войти / Зарегистрироваться
          </button>
          <p className="text-xs" style={{ color: 'var(--color-on-surface-muted)' }}>
            После входа вы сможете оформить подписку
          </p>
        </div>
      </div>
    </>
  );
}
