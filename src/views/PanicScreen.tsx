import { CirclePause, CirclePlay, Phone, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PanicScreen.css';

const EXERCISE_DURATION = 120;
const INHALE_DURATION = 4;
const EXHALE_DURATION = 6;
const CYCLE_DURATION = INHALE_DURATION + EXHALE_DURATION;

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function PanicScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [remaining, setRemaining] = useState(EXERCISE_DURATION);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setRemaining(current => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const elapsed = EXERCISE_DURATION - remaining;
  const cyclePosition = elapsed % CYCLE_DURATION;
  const isInhaling = cyclePosition < INHALE_DURATION;
  const phaseDuration = isInhaling ? INHALE_DURATION : EXHALE_DURATION;
  const phasePosition = isInhaling ? cyclePosition : cyclePosition - INHALE_DURATION;
  const phaseRemaining = Math.max(1, phaseDuration - phasePosition);
  const isFinished = remaining === 0;

  const reset = (): void => {
    setRemaining(EXERCISE_DURATION);
    setRunning(true);
  };

  return (
    <section className="panic-screen" aria-labelledby="panic-title">
      <button
        type="button"
        className="panic-screen__close"
        onClick={() => void navigate('/')}
        aria-label={t('panic.close')}
      >
        <X aria-hidden="true" />
      </button>

      <div className="panic-screen__content">
        <p className="panic-screen__eyebrow">{t('panic.eyebrow')}</p>
        <h1 id="panic-title">{t('panic.title')}</h1>
        <p className="panic-screen__intro">{t('panic.intro')}</p>

        <div
          className={`panic-screen__breathing-circle ${isInhaling ? 'is-inhaling' : 'is-exhaling'} ${running ? 'is-running' : 'is-paused'}`}
          aria-hidden="true"
        >
          <span>{isFinished ? '✓' : phaseRemaining}</span>
        </div>

        <div className="panic-screen__instruction" aria-live="polite" aria-atomic="true">
          <strong>
            {isFinished
              ? t('panic.finished')
              : isInhaling
                ? t('panic.breatheIn')
                : t('panic.breatheOut')}
          </strong>
          {!isFinished ? (
            <span>{running ? t('panic.followCircle') : t('panic.paused')}</span>
          ) : null}
        </div>

        <output className="panic-screen__timer" aria-label={t('panic.timeRemaining')}>
          {formatTime(remaining)}
        </output>

        <div className="panic-screen__controls">
          <button
            type="button"
            onClick={() => setRunning(current => !current)}
            disabled={isFinished}
          >
            {running ? <CirclePause aria-hidden="true" /> : <CirclePlay aria-hidden="true" />}
            {running ? t('panic.pause') : t('panic.continue')}
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw aria-hidden="true" /> {t('panic.restart')}
          </button>
        </div>

        <p className="panic-screen__safety-note">{t('panic.safetyNote')}</p>
        <div className="panic-screen__help-actions">
          <a href="tel:112" className="panic-screen__emergency-call">
            <Phone aria-hidden="true" /> {t('panic.call112')}
          </a>
          <button type="button" onClick={() => void navigate('/notfall')}>
            {t('panic.moreHelp')}
          </button>
        </div>
      </div>
    </section>
  );
}
