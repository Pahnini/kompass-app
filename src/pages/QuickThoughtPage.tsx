import { BookHeart, Bot, Link2, Mic, MicOff, Save, ShieldCheck, Trash2, Waves } from 'lucide-react';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import { APP_NAME } from '../config/brand';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useUserData } from '../hooks/useUserData';
import type { CalendarNote, ThoughtEntry } from '../types/index';
import './QuickThoughtPage.css';

const MAX_THOUGHT_LENGTH = 1500;

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createThoughtId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `thought-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(date);
}

export default function QuickThoughtPage(): React.ReactElement {
  const { calendarNotes, setCalendarNotes } = useUserData();
  const [draft, setDraft] = useState('');
  const [usedVoice, setUsedVoice] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const todayKey = getLocalDateKey();

  const appendTranscript = useCallback((transcript: string): void => {
    setDraft(current => {
      const next = [current.trim(), transcript.trim()].filter(Boolean).join(' ');
      return next.slice(0, MAX_THOUGHT_LENGTH);
    });
    setUsedVoice(true);
  }, []);

  const {
    isSupported,
    isListening,
    interimTranscript,
    error,
    startListening,
    stopListening,
    clearError,
  } = useSpeechRecognition({ onTranscript: appendTranscript });

  const todayEntries = useMemo(
    () => calendarNotes[todayKey]?.entries ?? [],
    [calendarNotes, todayKey]
  );

  const saveThought = (): void => {
    const text = draft.trim();
    if (!text) {
      setStatus('Schreibe oder sprich zuerst einen kurzen Gedanken.');
      return;
    }

    const currentNote: CalendarNote = calendarNotes[todayKey] ?? { title: '', text: '' };
    const entry: ThoughtEntry = {
      id: createThoughtId(),
      text,
      createdAt: new Date().toISOString(),
      inputMode: usedVoice ? 'voice' : 'keyboard',
      connections: [],
    };

    setCalendarNotes({
      ...calendarNotes,
      [todayKey]: {
        ...currentNote,
        entries: [...(currentNote.entries ?? []), entry],
      },
    });
    setDraft('');
    setUsedVoice(false);
    clearError();
    setStatus('Dein Gedanke wurde als privater Eintrag gespeichert.');
  };

  const removeThought = (id: string): void => {
    const currentNote = calendarNotes[todayKey];
    if (!currentNote) return;

    setCalendarNotes({
      ...calendarNotes,
      [todayKey]: {
        ...currentNote,
        entries: (currentNote.entries ?? []).filter(entry => entry.id !== id),
      },
    });
    setStatus('Der Eintrag wurde gelöscht.');
  };

  return (
    <div className="melforia-thoughts">
      <BackButton />

      <header className="melforia-thoughts__hero">
        <p>Kurzer Gedanke</p>
        <h1>Festhalten, ohne alles erklären zu müssen.</h1>
        <span>
          Sprich oder tippe einen Gedanken. Erst wenn du auf „Als Eintrag speichern“ drückst, wird
          der Text deinem Konto zugeordnet.
        </span>
      </header>

      <section className="melforia-thoughts__card" aria-labelledby="thought-input-heading">
        <div className="melforia-thoughts__heading">
          <div>
            <p>Entwurf</p>
            <h2 id="thought-input-heading">Was möchtest du kurz festhalten?</h2>
          </div>
          <Mic aria-hidden="true" />
        </div>

        <div className="melforia-thoughts__privacy">
          <ShieldCheck aria-hidden="true" />
          <p>
            {APP_NAME} speichert keine Audioaufnahme. Die Sprache-zu-Text-Verarbeitung übernimmt
            dein Browser oder dessen Spracherkennungsdienst. Du kannst jederzeit nur tippen.
          </p>
        </div>

        <textarea
          value={draft}
          onChange={event => {
            setDraft(event.currentTarget.value.slice(0, MAX_THOUGHT_LENGTH));
            setStatus(null);
          }}
          rows={7}
          maxLength={MAX_THOUGHT_LENGTH}
          placeholder="Zum Beispiel: Ich möchte später noch über den heutigen Morgen nachdenken …"
          aria-describedby="thought-counter speech-status"
        />

        {interimTranscript && (
          <p className="melforia-thoughts__interim" aria-live="polite">
            Erkannt: {interimTranscript}
          </p>
        )}

        <div className="melforia-thoughts__meta">
          <small id="thought-counter">
            {draft.length} / {MAX_THOUGHT_LENGTH} Zeichen
          </small>
          <small>{isSupported ? 'Spracheingabe verfügbar' : 'Nur Texteingabe verfügbar'}</small>
        </div>

        <div className="melforia-thoughts__actions">
          <button
            type="button"
            className={isListening ? 'is-listening' : ''}
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
          >
            {isListening ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
            {isListening ? 'Aufnahme beenden' : 'Gedanken sprechen'}
          </button>
          <button
            type="button"
            className="is-secondary"
            onClick={() => {
              if (isListening) stopListening();
              setDraft('');
              setUsedVoice(false);
              setStatus(null);
              clearError();
            }}
            disabled={!draft && !isListening}
          >
            <Trash2 aria-hidden="true" />
            Entwurf verwerfen
          </button>
          <button type="button" className="is-save" onClick={saveThought} disabled={!draft.trim()}>
            <Save aria-hidden="true" />
            Als Eintrag speichern
          </button>
        </div>

        <div id="speech-status" aria-live="polite">
          {isListening && <p className="melforia-thoughts__status">Ich höre zu …</p>}
          {error && <p className="melforia-thoughts__status is-error">{error}</p>}
          {status && <p className="melforia-thoughts__status">{status}</p>}
        </div>
      </section>

      <section className="melforia-thoughts__connections" aria-labelledby="connections-heading">
        <div>
          <Link2 aria-hidden="true" />
          <div>
            <p>Nächster Ausbauschritt</p>
            <h2 id="connections-heading">Gedanken später bewusst verbinden</h2>
          </div>
        </div>
        <p>
          Einträge sind bereits so vorbereitet, dass sie künftig nur nach deiner Zustimmung mit
          Stimmung, Reflexion oder der Begleitung verbunden werden können.
        </p>
        <nav aria-label="Verwandte Bereiche">
          <Link to="/mood">
            <Waves aria-hidden="true" /> Stimmung
          </Link>
          <Link to="/deinweg">
            <BookHeart aria-hidden="true" /> Reflexion
          </Link>
          <Link to="/nova">
            <Bot aria-hidden="true" /> Begleitung
          </Link>
        </nav>
      </section>

      {todayEntries.length > 0 && (
        <section className="melforia-thoughts__saved" aria-labelledby="saved-thoughts-heading">
          <div className="melforia-thoughts__heading">
            <div>
              <p>Nur für dich</p>
              <h2 id="saved-thoughts-heading">Heute gespeichert</h2>
            </div>
            <strong>{todayEntries.length}</strong>
          </div>
          <ul>
            {[...todayEntries].reverse().map(entry => (
              <li key={entry.id}>
                <div>
                  <small>
                    {formatTime(entry.createdAt)} Uhr ·{' '}
                    {entry.inputMode === 'voice' ? 'gesprochen' : 'getippt'}
                  </small>
                  <p>{entry.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeThought(entry.id)}
                  aria-label="Gedanken löschen"
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
