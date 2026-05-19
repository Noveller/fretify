import { useState } from 'react';
import { MODULES, type Lesson } from '../lessons/lessonData';
import { useProgress } from '../lessons/useProgress';
import { LessonSession } from './LessonSession';

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LessonCard({
  lesson, locked, completed, onClick,
}: {
  lesson: Lesson; locked: boolean; completed: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className="w-full text-left rounded-xl p-4 transition-all"
      style={{
        backgroundColor: completed
          ? 'color-mix(in srgb, var(--color-accent) 12%, var(--color-surface-2))'
          : 'var(--color-surface-2)',
        border: completed
          ? '1.5px solid var(--color-accent)'
          : locked
          ? '1.5px solid var(--color-fret)'
          : '1.5px solid var(--color-fret)',
        opacity: locked ? 0.45 : 1,
        cursor: locked ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-on-surface)' }}>
            {lesson.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-muted)' }}>
            {lesson.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface-muted)' }}>
            +{lesson.xpReward} XP
          </span>
          <span style={{ color: completed ? 'var(--color-accent)' : 'var(--color-on-surface-muted)' }}>
            {locked ? <LockIcon /> : completed ? <CheckIcon /> : null}
          </span>
        </div>
      </div>
    </button>
  );
}

export function LessonsView() {
  const { completed, markComplete } = useProgress();
  const [active, setActive] = useState<{ lesson: Lesson } | null>(null);

  const totalXP = MODULES.flatMap(m => m.lessons)
    .filter(l => completed.has(l.id))
    .reduce((s, l) => s + l.xpReward, 0);

  if (active) {
    return (
      <div className="w-full max-w-md mx-auto min-h-64">
        <LessonSession
          lesson={active.lesson}
          onComplete={(xp) => {
            markComplete(active.lesson.id);
            setActive(null);
          }}
          onExit={() => setActive(null)}
        />
      </div>
    );
  }

  // Flatten all lessons to determine unlock order globally
  const allLessons = MODULES.flatMap(m => m.lessons);

  function isLocked(lesson: Lesson): boolean {
    const idx = allLessons.findIndex(l => l.id === lesson.id);
    if (idx === 0) return false;
    return !completed.has(allLessons[idx - 1].id);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-md mx-auto">
      {/* XP summary */}
      <div className="rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-0.5"
            style={{ color: 'var(--color-on-surface-muted)' }}>Прогресс</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {totalXP} XP
          </p>
        </div>
        <div className="text-3xl">🎸</div>
      </div>

      {/* Modules */}
      {MODULES.map(module => (
        <div key={module.id} className="flex flex-col gap-3">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-on-surface)' }}>
              {module.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-muted)' }}>
              {module.subtitle}
            </p>
          </div>

          {module.lessons.length === 0 ? (
            <div className="rounded-xl p-4 text-center"
              style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}>
              <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
                Скоро
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {module.lessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  locked={isLocked(lesson)}
                  completed={completed.has(lesson.id)}
                  onClick={() => setActive({ lesson })}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
