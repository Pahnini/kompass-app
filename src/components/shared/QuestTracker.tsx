// src/components/QuestTracker.tsx
import { useQuests } from '../../hooks/useQuest';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGamification } from '../../context/GamificationContext';
import { QUESTS, levelFor } from '../../utils/gamification';
import { ARCADE_GAMES, isArcadeUnlocked } from '../../utils/arcade';
import '../../styles/Gamification.css';

export const QuestTracker = () => {
  const { quests } = useQuests();
  const { state, demo, select, setEnabled, status, retrySync, syncPending, rewardNotice } =
    useGamification();
  const level = levelFor(state.xp);
  const unlocked = ARCADE_GAMES.filter(game => isArcadeUnlocked(game.id, state.xp));
  const nextGame = ARCADE_GAMES.find(game => !isArcadeUnlocked(game.id, state.xp));

  return (
    <section className="game-panel" aria-labelledby="quest-heading">
      <header className="game-heading">
        <div>
          <p>In deinem Tempo · {state.day}</p>
          <h2 id="quest-heading">Deine kleinen Schritte</h2>
        </div>
        <label className="game-toggle">
          <input
            type="checkbox"
            checked={state.enabled}
            onChange={e => setEnabled(e.target.checked)}
          />{' '}
          Gamification aktiv
        </label>
      </header>
      <p className="game-caption">
        Wähle bis zu drei Tagesaufgaben. Du kannst jederzeit pausieren; gesammelte XP und Abzeichen
        bleiben erhalten. Du erhältst höchstens drei Tagesboni pro Tag, auch wenn du die Auswahl
        wechselst.
      </p>
      <div className="game-summary">
        <Sparkles aria-hidden="true" />
        <strong>
          {state.xp} XP · Level {level.level}
        </strong>
        <span>{level.remaining} XP bis zum nächsten Level</span>
      </div>
      {rewardNotice && (
        <p role="status" className="game-caption">
          {rewardNotice}
        </p>
      )}
      <Link to={demo ? '/arcade-demo' : '/arcade'} className="home-test-link">
        Arcade · {unlocked.length} von 3 Spielen freigeschaltet
        {nextGame
          ? ` · Noch ${nextGame.unlockXP - state.xp} XP bis ${nextGame.title}`
          : ' · Alle Spiele bleiben verfügbar'}{' '}
        →
      </Link>
      <div
        className="game-level"
        role="progressbar"
        aria-label="Fortschritt zum nächsten Level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(level.progress)}
      >
        <span style={{ width: `${level.progress}%` }} />
      </div>
      {state.enabled ? (
        <>
          <fieldset className="game-choices">
            <legend>Meine Tagesauswahl</legend>
            {QUESTS.filter(q => q.period === 'daily').map(q => (
              <label key={q.id}>
                <input
                  type="checkbox"
                  checked={state.selected.includes(q.id)}
                  disabled={!state.selected.includes(q.id) && state.selected.length >= 3}
                  onChange={e =>
                    select(
                      e.target.checked
                        ? [...state.selected, q.id]
                        : state.selected.filter(id => id !== q.id)
                    )
                  }
                />
                <span>{q.title}</span>
              </label>
            ))}
          </fieldset>
          {(['daily', 'weekly'] as const).map(period => (
            <section className="game-period" key={period}>
              <h3>{period === 'daily' ? 'Heute' : 'Diese Woche'}</h3>
              {quests.filter(q => q.period === period).length === 0 && (
                <p>Wähle eine Aufgabe, die heute zu dir passt.</p>
              )}
              <div className="game-quests">
                {quests
                  .filter(q => q.period === period)
                  .map(q => (
                    <article key={q.id} className={q.completed ? 'is-complete' : ''}>
                      <div className="game-quest-top">
                        <span>
                          {q.completed ? (
                            <>
                              <Check size={16} aria-hidden="true" /> Erledigt
                            </>
                          ) : (
                            `${q.progress} / ${q.goal}`
                          )}
                        </span>
                        <strong>
                          {q.completed &&
                          !state.claimed.includes(
                            `${q.period === 'daily' ? state.day : state.week}:${q.period}:${q.id}`
                          )
                            ? 'Tagesbonuslimit erreicht'
                            : `+${q.rewardXP} XP`}
                        </strong>
                      </div>
                      <h4>{q.title}</h4>
                      <p>{q.description}</p>
                      {demo ? (
                        <small>Im Demobereich ausprobieren</small>
                      ) : (
                        <Link to={q.to}>
                          {q.completed ? 'Bereich öffnen' : 'Loslegen'}{' '}
                          <ChevronRight size={16} aria-hidden="true" />
                        </Link>
                      )}
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </>
      ) : (
        <p role="status">Gamification pausiert. Alle App-Funktionen bleiben verfügbar.</p>
      )}
      <p className="game-caption">
        {demo
          ? 'Demofortschritt bleibt getrennt von deinem Konto.'
          : 'Aufgaben und Abzeichen bleiben kontogetrennt in diesem Browser; XP werden zusätzlich deinem Konto zugeordnet.'}{' '}
        Es werden keine Gedanken oder Stimmungsinhalte für Quests gespeichert.
      </p>
      {status && (
        <p role="status" className="game-status">
          {status}
        </p>
      )}
      {!demo && (
        <button type="button" disabled={syncPending} onClick={retrySync}>
          {syncPending ? 'XP werden gespeichert …' : 'Kontopunkte erneut synchronisieren'}
        </button>
      )}
    </section>
  );
};
