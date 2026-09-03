import { Accessibility, ChevronLeft, ChevronRight, Compass, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import './OnboardingModal.css';

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: OnboardingModalProps): React.ReactElement {
  const [step, setStep] = useState(0);
  const steps = [
    {
      icon: <Compass aria-hidden="true" />,
      eyebrow: '1 von 3 · Orientierung',
      title: 'Du entscheidest, was du nutzt.',
      text: 'Finde kurze Übungen, halte freiwillig Gedanken fest und ordne deine Stimmung ein. Du kannst jeden Bereich einzeln nutzen.',
    },
    {
      icon: <ShieldCheck aria-hidden="true" />,
      eyebrow: '2 von 3 · Deine Daten',
      title: 'Speichern passiert nicht heimlich.',
      text: 'Entwürfe werden erst durch deine Bestätigung gespeichert. Sprachnotizen speichern keine Audioaufnahme. Nova-Chats werden in Test 0.1 nicht als Verlauf gespeichert.',
    },
    {
      icon: <Accessibility aria-hidden="true" />,
      eyebrow: '3 von 3 · Grenzen und Hilfe',
      title: 'Die App ergänzt Hilfe – sie ersetzt sie nicht.',
      text: 'Melforia stellt keine Diagnose und ist kein Notfalldienst. Über den roten Hilfe-Button findest du jederzeit echte Anlaufstellen. Vorlesen und Bedienhilfen kannst du anpassen.',
    },
  ] as const;
  const current = steps[step];

  return (
    <div
      className="ds-modal melforia-onboarding"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="ds-box melforia-onboarding__box">
        <div className="melforia-onboarding__progress" aria-label={`Schritt ${step + 1} von 3`}>
          {steps.map((item, index) => (
            <span key={item.eyebrow} className={index <= step ? 'is-active' : ''} />
          ))}
        </div>
        <div className="melforia-onboarding__icon">{current.icon}</div>
        <p>{current.eyebrow}</p>
        <h2 id="onboarding-title">{current.title}</h2>
        <div className="melforia-onboarding__copy">{current.text}</div>
        <div className="melforia-onboarding__actions">
          {step > 0 ? (
            <button
              type="button"
              className="is-secondary"
              onClick={() => setStep(value => value - 1)}
            >
              <ChevronLeft aria-hidden="true" /> Zurück
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(value => value + 1)}>
              Weiter <ChevronRight aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={onClose}>
              App entdecken
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
