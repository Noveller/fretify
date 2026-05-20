import { useTranslation } from 'react-i18next';
import { useLessonEngine } from '../lessons/useLessonEngine';
import { ChordHearExercise } from './exercises/ChordHearExercise';
import { ScaleHearExercise } from './exercises/ScaleHearExercise';
import type { Lesson } from '../lessons/lessonData';

interface Props {
  lesson: Lesson;
  onComplete: (xp: number) => void;
  onExit: () => void;
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'}
      stroke={filled ? '#ef4444' : 'var(--color-fret)'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function LessonSession({ lesson, onComplete, onExit }: Props) {
  const { t } = useTranslation();
  const scaleNames = t('scales.names', { returnObjects: true }) as Record<string, string>;
  const tScale = (name: string) => scaleNames[name] ?? name;

  const engine = useLessonEngine(lesson.exercises);
  const { exercise, idx, total, lives, xp, phase, lastCorrect, submit, advance } = engine;

  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center gap-8 min-h-64 text-center">
        <div className="text-6xl">🎸</div>
        <div>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
            {t('lessons.lessonComplete')}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
            {t('lessons.xpEarned', { xp })}
          </p>
        </div>
        <button
          onClick={() => onComplete(xp)}
          className="px-8 py-3 rounded-xl text-base font-bold"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
        >
          {t('common.continue')}
        </button>
      </div>
    );
  }

  if (phase === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center gap-8 min-h-64 text-center">
        <div className="text-6xl">💔</div>
        <div>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
            {t('lessons.noLives')}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-muted)' }}>
            {t('lessons.tryAgain')}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onExit}
            className="px-6 py-3 rounded-xl text-base font-medium"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface)',
              border: '1px solid var(--color-fret)' }}>
            {t('common.exit')}
          </button>
          <button onClick={engine.reset}
            className="px-6 py-3 rounded-xl text-base font-bold"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}>
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  const inFeedback = phase === 'feedback';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onExit} className="text-sm hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-on-surface-muted)' }}>✕</button>

        {/* Progress bar */}
        <div className="flex-1 rounded-full h-3 overflow-hidden"
          style={{ backgroundColor: 'var(--color-surface-2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(idx / total) * 100}%`, backgroundColor: 'var(--color-accent)' }} />
        </div>

        {/* Hearts */}
        <div className="flex gap-1">
          {Array.from({ length: 3 }, (_, i) => <Heart key={i} filled={i < lives} />)}
        </div>
      </div>

      {/* Exercise */}
      <div className="flex-1 flex flex-col items-center justify-center pb-32">
        {exercise.type === 'chord-hear' && (
          <ChordHearExercise
            chord={exercise.chord}
            distractors={exercise.distractors}
            disabled={inFeedback}
            correctAnswer={exercise.chord}
            onAnswer={submit}
          />
        )}
        {exercise.type === 'scale-hear' && (
          <ScaleHearExercise
            rootNote={exercise.rootNote}
            scale={exercise.scale}
            distractors={exercise.distractors}
            disabled={inFeedback}
            onAnswer={submit}
          />
        )}
      </div>

      {/* Feedback panel */}
      {inFeedback && (
        <div className="fixed bottom-0 left-0 right-0 px-4 py-5 flex items-center justify-between gap-4"
          style={{
            backgroundColor: lastCorrect ? '#dcfce7' : '#fee2e2',
            borderTop: `2px solid ${lastCorrect ? '#22c55e' : '#ef4444'}`,
          }}>
          <div>
            <p className="font-bold text-base" style={{ color: lastCorrect ? '#16a34a' : '#dc2626' }}>
              {lastCorrect ? t('lessons.correct') : t('lessons.wrong')}
            </p>
            {!lastCorrect && (
              <p className="text-sm" style={{ color: '#dc2626' }}>
                {t('lessons.correctAnswer')}:{' '}
                {exercise.type === 'chord-hear' ? exercise.chord : tScale(exercise.scale)}
              </p>
            )}
          </div>
          <button
            onClick={advance}
            className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: lastCorrect ? '#16a34a' : '#dc2626',
              color: '#fff',
            }}
          >
            {t('common.continue')}
          </button>
        </div>
      )}
    </div>
  );
}
