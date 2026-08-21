import { Accessibility, Eye, Gauge, Keyboard, Square, Volume2, Waves } from 'lucide-react';
import type React from 'react';
import BackButton from '../components/ui/BackButton';
import { APP_NAME } from '../config/brand';
import { useAccessibility } from '../hooks/useAccessibility';
import './AccessibilityPage.css';

interface SettingSwitchProps {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
}

function SettingSwitch({ checked, description, label, onChange }: SettingSwitchProps) {
  return (
    <label className="melforia-accessibility-switch">
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.currentTarget.checked)}
      />
      <i aria-hidden="true" />
    </label>
  );
}

export default function AccessibilityPage(): React.ReactElement {
  const { settings, updateSettings, speechSupported, isSpeaking, speak, stopSpeaking } =
    useAccessibility();

  const testSpeech = (): void => {
    speak(
      `Willkommen bei ${APP_NAME}. Die Sprachausgabe ist aktiv. Du kannst dir die Inhalte jeder Seite vorlesen lassen.`
    );
  };

  return (
    <div className="melforia-accessibility-page">
      <BackButton />

      <header className="melforia-accessibility-hero">
        <span aria-hidden="true">
          <Accessibility size={27} />
        </span>
        <div>
          <p className="melforia-accessibility-eyebrow">Barrierefreiheit</p>
          <h1>{APP_NAME} leichter nutzen</h1>
          <p>Stelle Vorlesen, Lesbarkeit, Fokus und Bewegung passend für dich ein.</p>
        </div>
      </header>

      <section className="melforia-accessibility-card" aria-labelledby="speech-heading">
        <div className="melforia-accessibility-card__title">
          <Volume2 aria-hidden="true" />
          <div>
            <p className="melforia-accessibility-step">Sprachausgabe</p>
            <h2 id="speech-heading">Seiten vorlesen lassen</h2>
          </div>
        </div>

        {!speechSupported && (
          <p className="melforia-accessibility-warning" role="status">
            Dieser Browser bietet leider keine Sprachausgabe. Ein installierter Screenreader kann
            die App trotzdem bedienen.
          </p>
        )}

        <SettingSwitch
          checked={settings.speechControlsEnabled}
          label="Vorlesen-Schaltfläche anzeigen"
          description="Blendet unten rechts auf jeder App-Seite eine Start- und Stopp-Taste ein."
          onChange={checked => updateSettings({ speechControlsEnabled: checked })}
        />

        <div className="melforia-accessibility-rate">
          <div>
            <Gauge size={20} aria-hidden="true" />
            <label htmlFor="speech-rate">Lesegeschwindigkeit</label>
          </div>
          <input
            id="speech-rate"
            type="range"
            min="0.7"
            max="1.4"
            step="0.1"
            value={settings.speechRate}
            onChange={event => updateSettings({ speechRate: Number(event.currentTarget.value) })}
          />
          <output htmlFor="speech-rate">{settings.speechRate.toFixed(1)}×</output>
        </div>

        <button
          type="button"
          className="melforia-accessibility-test"
          onClick={isSpeaking ? stopSpeaking : testSpeech}
          disabled={!speechSupported}
        >
          {isSpeaking ? (
            <Square size={18} aria-hidden="true" />
          ) : (
            <Volume2 size={19} aria-hidden="true" />
          )}
          {isSpeaking ? 'Vorlesen stoppen' : 'Sprachausgabe testen'}
        </button>

        <p className="melforia-accessibility-privacy">
          Die Funktion verwendet die Stimme deines Browsers oder Betriebssystems. Melforia sendet
          den vorgelesenen Text nicht an den Nova-Endpunkt und benötigt dafür keinen API-Schlüssel.
        </p>
      </section>

      <section className="melforia-accessibility-card" aria-labelledby="reader-heading">
        <div className="melforia-accessibility-card__title">
          <Keyboard aria-hidden="true" />
          <div>
            <p className="melforia-accessibility-step">Screenreader</p>
            <h2 id="reader-heading">Mit Bedienungshilfen navigieren</h2>
          </div>
        </div>

        <p>
          Die Screenreader-Unterstützung ist immer aktiv. Seitenbereiche, Überschriften, Navigation
          und Statusmeldungen sind dafür ausgezeichnet. Über die Tab-Taste erreichst du alle
          wichtigen Bedienelemente.
        </p>

        <ul className="melforia-screenreader-list">
          <li>
            <strong>Windows-Sprachausgabe:</strong> Windows-Taste + Strg + Eingabetaste
          </li>
          <li>
            <strong>VoiceOver auf Apple-Geräten:</strong> Befehlstaste + F5 beziehungsweise in den
            Bedienungshilfen aktivieren
          </li>
          <li>
            <strong>TalkBack auf Android:</strong> Einstellungen → Bedienungshilfen → TalkBack
          </li>
        </ul>
      </section>

      <section className="melforia-accessibility-card" aria-labelledby="display-heading">
        <div className="melforia-accessibility-card__title">
          <Eye aria-hidden="true" />
          <div>
            <p className="melforia-accessibility-step">Lesbarkeit</p>
            <h2 id="display-heading">Darstellung anpassen</h2>
          </div>
        </div>

        <SettingSwitch
          checked={settings.largeText}
          label="Größere Schrift"
          description="Vergrößert Texte und Bedienelemente in der gesamten App."
          onChange={checked => updateSettings({ largeText: checked })}
        />
        <SettingSwitch
          checked={settings.enhancedFocus}
          label="Tastaturfokus deutlich zeigen"
          description="Markiert das aktuell ausgewählte Element mit einem gut sichtbaren Rahmen."
          onChange={checked => updateSettings({ enhancedFocus: checked })}
        />
        <SettingSwitch
          checked={settings.reducedMotion}
          label="Bewegungen reduzieren"
          description="Reduziert Animationen und Übergänge, wenn Bewegung unangenehm ist."
          onChange={checked => updateSettings({ reducedMotion: checked })}
        />

        <div className="melforia-accessibility-note">
          <Waves size={20} aria-hidden="true" />
          <span>Deine Einstellungen bleiben ausschließlich in diesem Browser gespeichert.</span>
        </div>
      </section>
    </div>
  );
}
