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
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-8">

      {/* Hero */}
      <div className="rounded-2xl p-6 flex flex-col gap-3"
        style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <p className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
          👋 Привет
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-muted)' }}>
          Меня зовут <strong style={{ color: 'var(--color-on-surface)' }}>Alex</strong> —
          создатель Fretify. Я фронтенд-разработчик и гитарист. Играю на гитаре уже
          несколько лет и, как многие, прошёл через одну и ту же проблему:
        </p>
        <p className="text-sm italic px-4 py-3 rounded-xl"
          style={{ color: 'var(--color-on-surface)', backgroundColor: 'var(--color-surface)',
            borderLeft: '3px solid var(--color-accent)' }}>
          я мог играть песни, но гриф гитары оставался для меня "непонятной картой".
        </p>
      </div>

      <Divider />

      <Section emoji="🎯" title="Зачем существует Fretify">
        <p>Изучение грифа — одна из самых сложных задач для гитаристов. Ты учишь:</p>
        <div className="flex flex-col gap-1 pl-1">
          <Bullet>формы аккордов</Bullet>
          <Bullet>табы</Bullet>
          <Bullet>паттерны гамм</Bullet>
        </div>
        <p>
          Но в итоге гриф всё равно остаётся чем-то, что приходится "вспоминать",
          а не понимать.
        </p>
        <p>Я создал Fretify, потому что мне не хватало простого инструмента, который помогает:</p>
        <div className="flex flex-col gap-1 pl-1">
          <Bullet>визуально понимать гриф</Bullet>
          <Bullet>связывать теорию с реальными позициями</Bullet>
          <Bullet>тренировать гаммы и ноты в понятной форме</Bullet>
          <Bullet>развивать мышечную и визуальную память грифа</Bullet>
        </div>
      </Section>

      <Divider />

      <Section emoji="🧠" title="Идея проекта">
        <p>Fretify — это не просто визуализация нот.</p>
        <p>Это инструмент для обучения, который помогает:</p>
        <div className="flex flex-col gap-1 pl-1">
          <Bullet>видеть ноты мгновенно</Bullet>
          <Bullet>изучать гаммы и аккорды наглядно</Bullet>
          <Bullet>запоминать закономерности грифа</Bullet>
          <Bullet>постепенно перестать думать в табах и начать думать в музыке</Bullet>
        </div>
      </Section>

      <Divider />

      <Section emoji="🚀" title="Моя цель">
        <p>Моя цель проста:</p>
        <p className="font-medium" style={{ color: 'var(--color-on-surface)' }}>
          помочь гитаристам действительно понять гриф, а не просто заучить его.
        </p>
        <p>
          Я хочу, чтобы Fretify стал инструментом для ежедневной практики — тем, что
          открываешь на 5–10 минут в день и постепенно становишься увереннее в музыке.
        </p>
      </Section>

      <Divider />

      <Section emoji="❤️" title="Почему я продолжаю развивать проект">
        <p>Этот проект для меня личный. Он объединяет две мои сферы:</p>
        <div className="flex gap-3 mt-1">
          <div className="flex-1 rounded-xl px-4 py-3 text-center"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
            <div className="text-lg mb-1">💻</div>
            <div className="text-xs font-medium">разработка</div>
          </div>
          <div className="flex-1 rounded-xl px-4 py-3 text-center"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
            <div className="text-lg mb-1">🎸</div>
            <div className="text-xs font-medium">музыка</div>
          </div>
        </div>
        <p>
          Я продолжаю его развивать, потому что верю: обучение гитаре должно быть
          визуальным, простым и приятным, а не сложным и раздражающим.
        </p>
      </Section>

      <Divider />

      {/* Support */}
      <div className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
            🙏 Поддержка
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-muted)' }}>
            Если Fretify оказался полезным, ты можешь поддержать проект — поделившись им
            или сделав донат. Любая поддержка помогает развивать инструмент и добавлять
            новые обучающие режимы.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)',
              border: '1px solid var(--color-fret)' }}
          >
            Поделиться
          </button>
          <a
            href="https://www.buymeacoffee.com/chakopss"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
          >
            ☕ Поддержать
          </a>
        </div>
      </div>

      {/* Footer signature */}
      <p className="text-center text-xs pb-2" style={{ color: 'var(--color-on-surface-muted)' }}>
        сделано с ❤️ — Alex (chakopss)
      </p>
    </div>
  );
}
