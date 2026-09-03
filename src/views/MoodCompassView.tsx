import { Save, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import MoodCompass from '../components/shared/MoodCompass';
import { t } from 'i18next';
import './MoodCompassView.css';

type MoodEntry = { id: string; mood: string; note: string; createdAt: string };
const STORAGE_KEY = 'melforia_mood_history_v1';

function loadHistory(): MoodEntry[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
    return Array.isArray(value) ? (value as MoodEntry[]).slice(0, 30) : [];
  } catch {
    return [];
  }
}

const MoodCompassView: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<MoodEntry[]>(loadHistory);
  const [status, setStatus] = useState('');

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setStatus('');
  };

  const saveMood = (): void => {
    if (!selectedMood) {
      setStatus('Wähle zuerst eine Stimmung aus.');
      return;
    }
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: selectedMood,
      note: note.trim().slice(0, 300),
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...history].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setHistory(next);
    setSelectedMood(null);
    setNote('');
    setStatus('Dein Check-in wurde nur in diesem Browser gespeichert.');
  };

  const deleteMood = (id: string): void => {
    const next = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setHistory(next);
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('moodCompass.title')}</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1rem', maxWidth: '600px' }}>
        {t('moodCompass.subtitle')}
      </p>

      {/* Zentrierender Wrapper */}
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '0 1rem',
          boxSizing: 'border-box',
        }}
      >
        <MoodCompass selected={selectedMood} onSelectMood={handleMoodSelect} />
      </div>

      <section className="mood-save" aria-labelledby="mood-save-heading">
        <h2 id="mood-save-heading">Diesen Moment freiwillig festhalten</h2>
        <p>Ohne Diagnose und ohne automatische Weitergabe an Nova.</p>
        <label>
          Optionale kurze Notiz
          <textarea
            value={note}
            onChange={event => setNote(event.currentTarget.value.slice(0, 300))}
            maxLength={300}
            rows={3}
            placeholder="Was ist gerade wichtig?"
          />
        </label>
        <button type="button" onClick={saveMood} disabled={!selectedMood}>
          <Save aria-hidden="true" /> Check-in lokal speichern
        </button>
        {status && (
          <p role="status" className="mood-save__status">
            {status}
          </p>
        )}
      </section>

      {history.length > 0 && (
        <section className="mood-history" aria-labelledby="mood-history-heading">
          <h2 id="mood-history-heading">Deine letzten Check-ins</h2>
          <p>Maximal 30 Einträge auf diesem Gerät.</p>
          <ul>
            {history.map(entry => (
              <li key={entry.id}>
                <div>
                  <strong>{t(`moodCompass.moods.${entry.mood}`)}</strong>
                  <small>
                    {new Intl.DateTimeFormat('de-DE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(entry.createdAt))}
                  </small>
                  {entry.note && <p>{entry.note}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => deleteMood(entry.id)}
                  aria-label="Check-in löschen"
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
};

export default MoodCompassView;
