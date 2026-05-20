import { useTranslation, Trans } from 'react-i18next';

interface SectionProps {
  emoji: string;
  title: string;
  children: React.ReactNode;
}

function Section({ emoji, title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--color-on-surface)' }}>
        <span>{emoji}</span>
        <span>{title}</span>
      </h2>
      <div className="text-sm leading-relaxed flex flex-col gap-2"
        style={{ color: 'var(--color-on-surface-muted)' }}>
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: 'var(--color-accent)' }} />
      <span>{children}</span>
    </div>
  );
}

function Divider() {
  return <hr style={{ borderColor: 'var(--color-fret)', opacity: 0.5 }} />;
}

export function AboutView() {
  const { t } = useTranslation();

  const whyItems         = t('about.whyItems',         { returnObjects: true }) as string[];
  const whyFretifyItems  = t('about.whyFretifyItems',  { returnObjects: true }) as string[];
  const ideaItems        = t('about.ideaItems',        { returnObjects: true }) as string[];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-8">

      {/* Hero */}
      <div className="rounded-2xl p-6 flex flex-col gap-3"
        style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <p className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
          👋 {t('about.heroTitle')}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-muted)' }}>
          <Trans
            i18nKey="about.heroText"
            components={{ 1: <strong style={{ color: 'var(--color-on-surface)' }} /> }}
          />
        </p>
        <p className="text-sm italic px-4 py-3 rounded-xl"
          style={{ color: 'var(--color-on-surface)', backgroundColor: 'var(--color-surface)',
            borderLeft: '3px solid var(--color-accent)' }}>
          {t('about.heroQuote')}
        </p>
      </div>

      <Divider />

      <Section emoji="🎯" title={t('about.whyTitle')}>
        <p>{t('about.whyIntro')}</p>
        <div className="flex flex-col gap-1 pl-1">
          {whyItems.map((item, i) => <Bullet key={i}>{item}</Bullet>)}
        </div>
        <p>{t('about.whyResult')}</p>
        <p>{t('about.whyFretify')}</p>
        <div className="flex flex-col gap-1 pl-1">
          {whyFretifyItems.map((item, i) => <Bullet key={i}>{item}</Bullet>)}
        </div>
      </Section>

      <Divider />

      <Section emoji="🧠" title={t('about.ideaTitle')}>
        <p>{t('about.ideaIntro')}</p>
        <div className="flex flex-col gap-1 pl-1">
          {ideaItems.map((item, i) => <Bullet key={i}>{item}</Bullet>)}
        </div>
      </Section>

      <Divider />

      <Section emoji="🚀" title={t('about.goalTitle')}>
        <p>{t('about.goalIntro')}</p>
        <p className="font-medium" style={{ color: 'var(--color-on-surface)' }}>
          {t('about.goalHighlight')}
        </p>
        <p>{t('about.goalDetail')}</p>
      </Section>

      <Divider />

      <Section emoji="❤️" title={t('about.whyContinueTitle')}>
        <p>{t('about.whyContinueIntro')}</p>
        <div className="flex gap-3 mt-1">
          <div className="flex-1 rounded-xl px-4 py-3 text-center"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
            <div className="text-lg mb-1">💻</div>
            <div className="text-xs font-medium">{t('about.sphere1')}</div>
          </div>
          <div className="flex-1 rounded-xl px-4 py-3 text-center"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
            <div className="text-lg mb-1">🎸</div>
            <div className="text-xs font-medium">{t('about.sphere2')}</div>
          </div>
        </div>
        <p>{t('about.whyContinueResult')}</p>
      </Section>

      <Divider />

      {/* Support */}
      <div className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
            🙏 {t('about.supportTitle')}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-muted)' }}>
            {t('about.supportText')}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)',
              border: '1px solid var(--color-fret)' }}
          >
            {t('common.share')}
          </button>
          <a
            href="https://www.buymeacoffee.com/chakopss"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
          >
            ☕ {t('common.support')}
          </a>
        </div>
      </div>

      {/* Footer signature */}
      <p className="text-center text-xs pb-2" style={{ color: 'var(--color-on-surface-muted)' }}>
        {t('about.footer')}
      </p>
    </div>
  );
}
