import type { Session } from '@supabase/supabase-js';
import {
  AlertTriangle,
  Check,
  ClipboardCheck,
  ExternalLink,
  Lightbulb,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import { APP_VERSION, APP_VERSION_LABEL } from '../config/brand';
import { FEATURE_CANDIDATES, type FeatureCandidateId } from '../data/featureCandidates';
import { TEST_TASKS } from '../data/testTasks';
import { submitTestFeedback } from '../services/feedbackService';
import { supabase } from '../utils/supabase';
import {
  detectBrowser,
  detectDevice,
  type DeviceType,
  type FeedbackCategory,
  type FeedbackTopic,
} from '../utils/testFeedback';
import './TestCenterPage.css';

const TEST_PROGRESS_KEY = 'melforia_test_tasks_v1';
const FEATURE_PRIORITY_KEY = 'melforia_feature_priorities_v1';
const MAX_FEATURE_PRIORITIES = 5;

const categoryOptions: Array<{ value: FeedbackCategory; label: string }> = [
  { value: 'general', label: 'Allgemeiner Eindruck' },
  { value: 'bug', label: 'Fehler oder Problem' },
  { value: 'nova', label: 'Digitale Begleitung' },
  { value: 'accessibility', label: 'Barrierefreiheit' },
  { value: 'design', label: 'Design' },
];

const deviceLabels: Record<DeviceType, string> = {
  mobile: 'Smartphone',
  tablet: 'Tablet',
  desktop: 'Computer / Laptop',
  unknown: 'Anderes Gerät',
};

const feedbackTopicOptions: Array<{ value: FeedbackTopic; label: string }> = [
  { value: 'navigation', label: 'Navigation' },
  { value: 'content', label: 'Inhalte & Verständlichkeit' },
  { value: 'design', label: 'Design & Lesbarkeit' },
  { value: 'performance', label: 'Geschwindigkeit & Stabilität' },
  { value: 'accessibility', label: 'Barrierefreiheit' },
  { value: 'assistant', label: 'Begleitung' },
  { value: 'voice-notes', label: 'Sprachnotizen' },
  { value: 'account', label: 'Anmeldung & Konto' },
];

function readStoredProgress(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem(TEST_PROGRESS_KEY) ?? '[]') as unknown;
    if (!Array.isArray(stored)) return [];
    const knownTaskIds = new Set(TEST_TASKS.map(task => task.id));
    return stored.filter(
      (value): value is string => typeof value === 'string' && knownTaskIds.has(value)
    );
  } catch {
    return [];
  }
}

function readStoredFeaturePriorities(): FeatureCandidateId[] {
  try {
    const stored = JSON.parse(localStorage.getItem(FEATURE_PRIORITY_KEY) ?? '[]') as unknown;
    if (!Array.isArray(stored)) return [];
    const knownFeatureIds = new Set(FEATURE_CANDIDATES.map(feature => feature.id));
    return stored
      .filter(
        (value): value is FeatureCandidateId =>
          typeof value === 'string' && knownFeatureIds.has(value as FeatureCandidateId)
      )
      .slice(0, MAX_FEATURE_PRIORITIES);
  } catch {
    return [];
  }
}

export default function TestCenterPage(): React.ReactElement {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>(readStoredProgress);
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [topics, setTopics] = useState<FeedbackTopic[]>([]);
  const [featurePriorities, setFeaturePriorities] = useState<FeatureCandidateId[]>(
    readStoredFeaturePriorities
  );
  const [missingFeature, setMissingFeature] = useState('');
  const [rating, setRating] = useState(0);
  const [deviceType, setDeviceType] = useState<DeviceType>(() => detectDevice(window.innerWidth));
  const [message, setMessage] = useState('');
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [browser] = useState(() => detectBrowser(window.navigator.userAgent));
  const progress = Math.round((completedTasks.length / TEST_TASKS.length) * 100);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoaded(true);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(TEST_PROGRESS_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem(FEATURE_PRIORITY_KEY, JSON.stringify(featurePriorities));
  }, [featurePriorities]);

  useEffect(() => {
    const targetId = location.hash === '#feedback' ? 'feedback' : location.hash.slice(1);
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  const toggleTask = (taskId: string): void => {
    setCompletedTasks(current =>
      current.includes(taskId) ? current.filter(id => id !== taskId) : [...current, taskId]
    );
  };

  const toggleFeedbackTopic = (topic: FeedbackTopic): void => {
    setTopics(current =>
      current.includes(topic) ? current.filter(value => value !== topic) : [...current, topic]
    );
  };

  const toggleFeaturePriority = (featureId: FeatureCandidateId): void => {
    setFeaturePriorities(current => {
      if (current.includes(featureId)) {
        return current.filter(value => value !== featureId);
      }
      if (current.length >= MAX_FEATURE_PRIORITIES) return current;
      return [...current, featureId];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus(null);

    if (!session) {
      setStatus({ type: 'error', text: 'Bitte melde dich an, bevor du Feedback sendest.' });
      return;
    }
    if (rating === 0) {
      setStatus({ type: 'error', text: 'Bitte wähle eine Bewertung von 1 bis 5 aus.' });
      return;
    }
    if (topics.length === 0) {
      setStatus({ type: 'error', text: 'Bitte wähle mindestens einen betroffenen Bereich aus.' });
      return;
    }
    if (featurePriorities.length === 0) {
      setStatus({ type: 'error', text: 'Bitte wähle mindestens eine wichtige Funktion aus.' });
      return;
    }
    if (!privacyConfirmed) {
      setStatus({ type: 'error', text: 'Bitte bestätige zuerst den Datenschutzhinweis.' });
      return;
    }

    setSubmitting(true);
    try {
      await submitTestFeedback({
        category,
        topics,
        featurePriorities,
        missingFeature,
        rating,
        deviceType,
        browser,
        message,
        completedTasks,
        appVersion: APP_VERSION,
      });
      setMessage('');
      setRating(0);
      setTopics([]);
      setMissingFeature('');
      setPrivacyConfirmed(false);
      setStatus({
        type: 'success',
        text: 'Danke! Dein Feedback wurde ohne Chatverlauf, Namen oder E-Mail-Adresse gespeichert.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Dein Feedback konnte gerade nicht gesendet werden.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="melforia-test-page">
      <BackButton />

      <header className="melforia-test-hero">
        <div className="melforia-test-hero__icon" aria-hidden="true">
          <ClipboardCheck size={27} />
        </div>
        <div>
          <span className="melforia-test-badge">{APP_VERSION_LABEL}</span>
          <h1>Die Testversion gemeinsam gestalten</h1>
          <p>
            Probiere die wichtigsten Bereiche in Ruhe aus. Die Aufgaben sind Vorschläge, kein Test
            deiner Person.
          </p>
        </div>
      </header>

      <section className="melforia-test-alert" aria-labelledby="test-safety-heading">
        <AlertTriangle aria-hidden="true" />
        <div>
          <h2 id="test-safety-heading">Wichtig vor dem Test</h2>
          <p>
            Dies ist eine frühe Testversion, keine Therapie und kein Medizinprodukt. Die digitale
            Begleitung arbeitet im kostenlosen Testmodus mit festen Regeln und kann Krisen nicht
            zuverlässig erkennen. Nutze nur harmlose oder erfundene Beispiele und trage keine echten
            Gesundheits-, Kontakt- oder Krisendaten ein.
          </p>
          <p>
            Bei unmittelbarer Gefahr: <strong>112 anrufen</strong> oder eine vertraute Person in
            deiner Nähe ansprechen.
          </p>
        </div>
      </section>

      <section
        id="funktionen-waehlen"
        className="melforia-test-card"
        aria-labelledby="feature-priorities-heading"
      >
        <div className="melforia-test-section-heading">
          <div>
            <p className="melforia-test-eyebrow">Funktionslabor</p>
            <h2 id="feature-priorities-heading">Was soll die App unbedingt können?</h2>
          </div>
          <strong aria-live="polite">
            {featurePriorities.length} / {MAX_FEATURE_PRIORITIES} gewählt
          </strong>
        </div>
        <p className="melforia-test-local-note" id="feature-priorities-help">
          Wähle bis zu fünf Funktionen, die dir für eine hilfreiche Testversion am wichtigsten
          wären. Deine Auswahl bleibt zunächst nur in diesem Browser und wird erst mit deinem
          Feedback übertragen.
        </p>

        <div className="melforia-feature-grid" aria-describedby="feature-priorities-help">
          {FEATURE_CANDIDATES.map(feature => {
            const isSelected = featurePriorities.includes(feature.id);
            const isDisabled = !isSelected && featurePriorities.length >= MAX_FEATURE_PRIORITIES;
            return (
              <article
                className={`melforia-feature-card ${isSelected ? 'is-selected' : ''}`}
                key={feature.id}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => toggleFeaturePriority(feature.id)}
                  />
                  <span className="melforia-feature-card__check" aria-hidden="true">
                    {isSelected && <Check size={17} />}
                  </span>
                  <span className="melforia-feature-card__copy">
                    <small className={`is-${feature.status}`}>
                      {feature.status === 'testable' ? 'Bereits testbar' : 'Idee für später'}
                    </small>
                    <strong>{feature.title}</strong>
                    <span>{feature.description}</span>
                  </span>
                </label>
                {feature.link && (
                  <Link
                    to={session ? feature.link.to : '/login'}
                    className="melforia-feature-card__link"
                  >
                    {session ? feature.link.label : 'Zum Anmelden'}
                    <ExternalLink size={14} aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>

        <div className="melforia-feature-hint">
          <Lightbulb aria-hidden="true" />
          <p>
            Eine wichtige Funktion fehlt? Du kannst sie unten im Feedback in einem kurzen Satz
            ergänzen.
          </p>
        </div>
      </section>

      <section className="melforia-test-card" aria-labelledby="test-tasks-heading">
        <div className="melforia-test-section-heading">
          <div>
            <p className="melforia-test-eyebrow">Geführter Test</p>
            <h2 id="test-tasks-heading">{TEST_TASKS.length} kurze Aufgaben</h2>
          </div>
          <strong>{progress}% erledigt</strong>
        </div>

        <div
          className="melforia-test-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Fortschritt der Testaufgaben"
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <p className="melforia-test-local-note">
          Deine Häkchen bleiben in diesem Browser. Wenn du Feedback absendest, werden nur die
          Kennungen der erledigten Testaufgaben zusammen mit deinem Feedback übertragen.
        </p>

        <div className="melforia-test-task-list">
          {TEST_TASKS.map((task, index) => {
            const isComplete = completedTasks.includes(task.id);
            return (
              <article
                className={`melforia-test-task ${isComplete ? 'is-complete' : ''}`}
                key={task.id}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="melforia-test-task__check" aria-hidden="true">
                    {isComplete ? <Check size={17} /> : index + 1}
                  </span>
                  <span>
                    <strong>{task.title}</strong>
                    <small>{task.description}</small>
                  </span>
                </label>
                {task.link && (
                  <Link to={task.link.to} className="melforia-test-task__link">
                    {task.link.label}
                    <ExternalLink size={15} aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section id="feedback" className="melforia-test-card" aria-labelledby="feedback-heading">
        <div className="melforia-test-section-heading">
          <div>
            <p className="melforia-test-eyebrow">Rückmeldung</p>
            <h2 id="feedback-heading">Was sollten wir verbessern?</h2>
          </div>
          <MessageSquareText aria-hidden="true" />
        </div>

        <div className="melforia-test-privacy-summary">
          <ShieldCheck aria-hidden="true" />
          <p>
            Gespeichert werden nur Kategorie, ausgewählte Bereiche und Funktionen, Bewertung, dein
            Text, grobe Geräte-/Browserart, erledigte Aufgaben und App-Version.{' '}
            <strong>Kein Name, keine E-Mail, keine Nutzer-ID und kein Chatverlauf.</strong>
          </p>
        </div>

        {!authLoaded && <p role="status">Anmeldestatus wird geprüft …</p>}
        {authLoaded && !session && (
          <div className="melforia-test-login-note">
            <LockKeyhole aria-hidden="true" />
            <div>
              <strong>Zum Senden bitte anmelden</strong>
              <p>
                Funktionsauswahl und Aufgaben kannst du schon ansehen. Rückmeldungen nehmen wir nur
                von angemeldeten Testpersonen an.
              </p>
              <Link to="/login">Anmelden oder Testkonto erstellen</Link>
            </div>
          </div>
        )}

        <form className="melforia-test-form" onSubmit={event => void handleSubmit(event)}>
          <div className="melforia-test-form__row">
            <label>
              Bereich
              <select
                value={category}
                onChange={event => setCategory(event.currentTarget.value as FeedbackCategory)}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Gerät
              <select
                value={deviceType}
                onChange={event => setDeviceType(event.currentTarget.value as DeviceType)}
              >
                {Object.entries(deviceLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="melforia-test-rating">
            <legend>Wie gut konntest du die App bedienen?</legend>
            <div>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
            <small>1 = sehr schwierig · 5 = sehr einfach</small>
          </fieldset>

          <fieldset className="melforia-test-topics">
            <legend>Welche Bereiche betrifft deine Rückmeldung?</legend>
            <p>Wähle mindestens einen und höchstens sechs Punkte.</p>
            <div>
              {feedbackTopicOptions.map(option => {
                const isChecked = topics.includes(option.value);
                const isDisabled = !isChecked && topics.length >= 6;
                return (
                  <label key={option.value}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => toggleFeedbackTopic(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="melforia-test-message">
            Welche Funktion fehlt dir noch? <span>(optional)</span>
            <textarea
              value={missingFeature}
              onChange={event => setMissingFeature(event.currentTarget.value.slice(0, 300))}
              maxLength={300}
              rows={3}
              placeholder="Zum Beispiel: Eine freiwillige Erinnerung, die ich selbst einstellen kann."
            />
            <small>{missingFeature.length} / 300 Zeichen</small>
          </label>

          <label className="melforia-test-message">
            Deine Rückmeldung
            <textarea
              value={message}
              onChange={event => setMessage(event.currentTarget.value)}
              minLength={10}
              maxLength={1500}
              rows={6}
              placeholder="Was hat gut funktioniert? Wo bist du nicht weitergekommen?"
              required
            />
            <small>
              {message.length} / 1500 Zeichen · Erkannter Browser: {browser}
            </small>
          </label>

          <label className="melforia-test-consent">
            <input
              type="checkbox"
              checked={privacyConfirmed}
              onChange={event => setPrivacyConfirmed(event.currentTarget.checked)}
              required
            />
            <span>
              Ich habe keine Namen, Kontaktdaten, Gesundheitsdaten oder echten Kriseninhalte in
              meine Rückmeldung geschrieben.
            </span>
          </label>

          {status && (
            <p className={`melforia-test-status is-${status.type}`} role="status">
              {status.text}
            </p>
          )}

          <button type="submit" className="melforia-test-submit" disabled={submitting || !session}>
            {submitting ? 'Feedback wird gesendet …' : 'Feedback sicher senden'}
          </button>
        </form>
      </section>
    </div>
  );
}
