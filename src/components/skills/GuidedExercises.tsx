import { CirclePause, CirclePlay, RotateCcw } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import './GuidedExercises.css';

type Exercise = {
  id: string;
  title: string;
  duration: number;
  intro: string;
  steps: string[];
};

const exercises: Exercise[] = [
  {
    id: 'breathing',
    title: 'Ruhig atmen',
    duration: 120,
    intro: 'Zwei Minuten, in deinem Tempo. Höre auf, wenn es sich unangenehm anfühlt.',
    steps: [
      'Atme vier Sekunden ruhig ein.',
      'Atme sechs Sekunden langsam aus.',
      'Wiederhole das ohne Druck.',
    ],
  },
  {
    id: 'grounding',
    title: '5–4–3–2–1',
    duration: 180,
    intro: 'Richte deine Aufmerksamkeit auf den Ort, an dem du gerade bist.',
    steps: [
      'Nenne 5 Dinge, die du siehst.',
      'Nenne 4 Dinge, die du fühlst.',
      'Nenne 3 Geräusche, 2 Gerüche und 1 Geschmack.',
    ],
  },
  {
    id: 'release',
    title: 'Kurz lockern',
    duration: 90,
    intro: 'Eine kleine Pause für Schultern, Hände und Gesicht.',
    steps: [
      'Ziehe die Schultern kurz hoch und lasse sie los.',
      'Öffne und schließe langsam deine Hände.',
      'Lockere Kiefer und Stirn.',
    ],
  },
  {
    id: 'next-step',
    title: 'Nur der nächste Schritt',
    duration: 120,
    intro: 'Wenn gerade alles zu viel wirkt, verkleinere die Aufgabe.',
    steps: [
      'Was muss nicht heute passieren?',
      'Was ist der kleinste mögliche Schritt?',
      'Entscheide nur, ob du ihn jetzt oder später machst.',
    ],
  },
];

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function GuidedExercises(): React.ReactElement {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const activeExercise = exercises.find(exercise => exercise.id === activeId) ?? null;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setRemaining(current => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const selectExercise = (exercise: Exercise): void => {
    setActiveId(exercise.id);
    setRemaining(exercise.duration);
    setRunning(false);
  };

  const reset = (): void => {
    if (!activeExercise) return;
    setRemaining(activeExercise.duration);
    setRunning(false);
  };

  return (
    <section className="guided-exercises" aria-labelledby="guided-exercises-heading">
      <div className="guided-exercises__heading">
        <div>
          <p>Kurzinterventionen</p>
          <h2 id="guided-exercises-heading">Eine kleine Übung für jetzt</h2>
        </div>
        <span>Ohne Bewertung · jederzeit abbrechbar</span>
      </div>

      <div className="guided-exercises__grid">
        {exercises.map(exercise => (
          <button
            type="button"
            key={exercise.id}
            className={activeId === exercise.id ? 'is-active' : ''}
            onClick={() => selectExercise(exercise)}
            aria-pressed={activeId === exercise.id}
          >
            <strong>{exercise.title}</strong>
            <small>{Math.ceil(exercise.duration / 60)} Min.</small>
          </button>
        ))}
      </div>

      {activeExercise && (
        <div className="guided-exercises__player" aria-live="polite">
          <div>
            <p>{activeExercise.intro}</p>
            <ol>
              {activeExercise.steps.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="guided-exercises__timer">
            <output aria-label={`${remaining} Sekunden verbleiben`}>{formatTime(remaining)}</output>
            <div>
              <button
                type="button"
                onClick={() => setRunning(current => !current)}
                disabled={remaining === 0}
              >
                {running ? <CirclePause aria-hidden="true" /> : <CirclePlay aria-hidden="true" />}
                {running ? 'Pause' : remaining === activeExercise.duration ? 'Start' : 'Weiter'}
              </button>
              <button type="button" onClick={reset}>
                <RotateCcw aria-hidden="true" /> Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
