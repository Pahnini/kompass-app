import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GamificationProvider, useGamification } from '../context/GamificationContext';
import { GameBadges } from '../components/shared/GameBadges';
import { QuestTracker } from '../components/shared/QuestTracker';
import GuidedExercises from '../components/skills/GuidedExercises';
import type { ActivityKind } from '../utils/gamification';
import '../styles/Gamification.css';
const scenarios: { id: ActivityKind | 'all'; label: string }[] = [
  { id: 'all', label: 'Alles ausprobieren' },
  { id: 'mood', label: 'Stimmungs-Check-in' },
  { id: 'skill', label: 'Skills & Übungen' },
  { id: 'thought', label: 'Kurzer Gedanke' },
  { id: 'goal', label: 'Kleines Ziel' },
];
function DemoContent() {
  const [params, setParams] = useSearchParams();
  const scenario = scenarios.find(s => s.id === params.get('scenario'))?.id ?? 'all';
  const { state, record, resetDemo, nextDemoDay } = useGamification();
  const [mood, setMood] = useState('');
  const [thought, setThought] = useState('');
  const [status, setStatus] = useState('');
  const show = (id: ActivityKind) => scenario === 'all' || scenario === id;
  const complete = (kind: ActivityKind, id: string) => {
    record(kind, id);
    setStatus(
      state.enabled
        ? 'Demoaktion abgeschlossen. Wiederholen vergibt keine zusätzlichen Tagespunkte.'
        : 'Demoaktion abgeschlossen. Gamification ist pausiert; es wurden keine Punkte vergeben.'
    );
  };
  return (
    <div className="demo-page">
      <header>
        <Link to="/testen">← Zur Testauswahl</Link>
        <h1>Dein Demobereich</h1>
        <p>
          Probiere Aufgaben, XP und Abzeichen mit Beispielen aus. Es werden keine Kontodaten
          geändert und keine Texte gespeichert. Nur der getrennte Demofortschritt bleibt in diesem
          Browser.
        </p>
      </header>
      <label>
        Was möchtest du testen?
        <select
          value={scenario}
          onChange={e => {
            setParams({ scenario: e.target.value });
            setStatus('');
          }}
          className="demo-scenario"
        >
          {scenarios.map(s => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      {show('mood') && (
        <section className="demo-fields">
          <h2>Stimmung ausprobieren</h2>
          <label>
            Eine Beispielstimmung
            <select value={mood} onChange={e => setMood(e.target.value)}>
              <option value="">Bitte wählen</option>
              <option value="calm">Ruhig</option>
              <option value="busy">Viel im Kopf</option>
              <option value="tired">Müde</option>
            </select>
          </label>
          <div className="demo-controls">
            <button disabled={!mood} onClick={() => complete('mood', 'demo-mood')}>
              Demo-Check-in abschließen
            </button>
          </div>
        </section>
      )}
      {show('skill') && (
        <>
          <GuidedExercises onComplete={id => complete('skill', id)} />
          <div className="demo-controls">
            {['Spaziergang', 'Musikpause', 'Wasser trinken'].map(id => (
              <button key={id} onClick={() => complete('skill', `demo-${id}`)}>
                {id} als Demo-Skill abschließen
              </button>
            ))}
          </div>
        </>
      )}
      {show('thought') && (
        <section className="demo-fields">
          <h2>Gedanken ausprobieren</h2>
          <label>
            Harmloser Beispielsatz
            <textarea
              rows={3}
              maxLength={300}
              value={thought}
              onChange={e => setThought(e.target.value)}
              placeholder="Heute möchte ich ein Buch lesen."
            />
          </label>
          <div className="demo-controls">
            <button
              disabled={!thought.trim()}
              onClick={() => {
                complete('thought', 'demo-thought');
                setThought('');
              }}
            >
              Demo-Eintrag abschließen
            </button>
          </div>
        </section>
      )}
      {show('goal') && (
        <section className="demo-fields">
          <h2>Ein Beispielziel</h2>
          <p>Meine Tasche für morgen vorbereiten.</p>
          <div className="demo-controls">
            <button onClick={() => complete('goal', 'demo-bag')}>Demo-Ziel erledigen</button>
          </div>
        </section>
      )}
      <p role="status">{status}</p>
      <div className="demo-controls">
        <button
          onClick={() => {
            nextDemoDay();
            setStatus('Demotag gewechselt: Tagesaufgaben starten neu, XP bleiben erhalten.');
          }}
        >
          Nächsten Demotag testen
        </button>
        <button
          onClick={() => {
            resetDemo();
            setThought('');
            setMood('');
            setStatus('Nur der Demofortschritt wurde zurückgesetzt.');
          }}
        >
          Demo zurücksetzen
        </button>
        <Link to="/panic">Atemübung öffnen</Link>
      </div>
      <QuestTracker />
      <Link to="/arcade-demo" className="home-test-link">
        Arcade-Belohnungen im Demomodus öffnen →
      </Link>
      <h2>Demo-Abzeichen · {state.xp} XP</h2>
      <GameBadges />
    </div>
  );
}
export default function DemoPage() {
  return (
    <GamificationProvider demo>
      <DemoContent />
    </GamificationProvider>
  );
}
