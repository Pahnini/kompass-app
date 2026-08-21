import { Settings, Square, Volume2 } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../hooks/useAccessibility';
import './AccessibilityToolbar.css';

export default function AccessibilityToolbar(): React.ReactElement | null {
  const { settings, speechSupported, isSpeaking, statusMessage, speakPage, stopSpeaking } =
    useAccessibility();

  if (!settings.speechControlsEnabled) return null;

  return (
    <div
      className="melforia-reading-toolbar"
      role="group"
      aria-label="Sprachausgabe"
      data-speech-ignore="true"
    >
      {isSpeaking ? (
        <button type="button" onClick={stopSpeaking} className="melforia-reading-toolbar__button">
          <Square size={17} aria-hidden="true" />
          <span>Stopp</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={speakPage}
          disabled={!speechSupported}
          className="melforia-reading-toolbar__button"
          title={speechSupported ? 'Aktuelle Seite vorlesen' : 'Im Browser nicht verfügbar'}
        >
          <Volume2 size={19} aria-hidden="true" />
          <span>Vorlesen</span>
        </button>
      )}

      <Link
        to="/barrierefreiheit"
        className="melforia-reading-toolbar__settings"
        aria-label="Einstellungen für Barrierefreiheit öffnen"
      >
        <Settings size={19} aria-hidden="true" />
      </Link>

      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </span>
    </div>
  );
}
