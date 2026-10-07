import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, LockKeyhole, Sparkles } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useUserData } from '../hooks/useUserData';
import { accountStorageKey, useScopedStorage } from '../hooks/useScopedStorage';
import {
  ARCADE_GAMES,
  EMPTY_ARCADE_RECORDS,
  isArcadeUnlocked,
  validateArcadeRecords,
  type ArcadeId,
} from '../utils/arcade';
import '../styles/Arcade.css';
const MemoryGame = lazy(() => import('../components/arcade/MemoryGame'));
const LightsGame = lazy(() => import('../components/arcade/LightsGame'));
const ThreeGame = lazy(() => import('../components/arcade/ThreeGame'));

export default function ArcadePage() {
  const { state, demo } = useGamification();
  const { userId } = useUserData();
  const key = accountStorageKey('melforia_arcade_v1', demo ? 'demo' : userId);
  const [records, writeRecords] = useScopedStorage(
    key,
    EMPTY_ARCADE_RECORDS,
    validateArcadeRecords
  );
  const recordsRef = useRef(records);
  recordsRef.current = records;
  const [active, setActive] = useState<ArcadeId | null>(null);
  const player = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (active) player.current?.focus();
  }, [active]);
  const [notice, setNotice] = useState('');
  const win = (id: ArcadeId, moves: number) => {
    const previous = recordsRef.current[id];
    const best = id === 'three' ? null : Math.min(previous?.best ?? moves, moves);
    const next = {
      ...recordsRef.current,
      [id]: { wins: Math.min((previous?.wins ?? 0) + 1, 1_000_000), best },
    };
    if (writeRecords(next)) {
      recordsRef.current = next;
      setNotice(
        'Runde abgeschlossen. Dein Spielergebnis bleibt in diesem Browser. Deine XP bleiben unverändert.'
      );
    } else
      setNotice(
        'Gut gespielt! Der Browser konnte das Spielergebnis nicht speichern. Deine XP bleiben unverändert.'
      );
  };
  return (
    <div className="arcade-page">
      <header className="arcade-hero">
        <span className="arcade-kicker">
          <Gamepad2 size={18} aria-hidden="true" /> Deine kleine Spielpause {demo && '· Demo'}
        </span>
        <h1>Arcade</h1>
        <p>
          Kleine Schritte, kleine Extras. Sammle XP mit deinen freiwilligen Aufgaben und schalte
          Spiele dauerhaft frei. Du bezahlst nichts mit deinen Punkten.
        </p>
        <div className="arcade-xp">
          <Sparkles size={18} aria-hidden="true" />
          <strong>{state.xp} XP gesammelt</strong>
          <Link to={demo ? '/demo' : '/'}>Aufgaben öffnen →</Link>
        </div>
        <p className="arcade-note">
          Kein Zeitlimit. Keine Werbung. Keine Ranglisten. Spielen vergibt keine XP und ist
          jederzeit beendbar. Hilfe und alle Alltagsfunktionen bleiben unabhängig von Punkten
          zugänglich.
        </p>
        {demo && (
          <p className="arcade-note">
            Dieser Bereich nutzt ausschließlich deinen getrennten Demofortschritt. Teste
            Freischaltungen unter „Aufgaben öffnen“; deine Kontopunkte werden nicht verändert.
          </p>
        )}
      </header>
      <div className="arcade-catalog">
        {ARCADE_GAMES.map((game, index) => {
          const unlocked = isArcadeUnlocked(game.id, state.xp);
          return (
            <article className={`arcade-card ${unlocked ? 'is-unlocked' : ''}`} key={game.id}>
              <div className={`arcade-cover arcade-cover--${game.id}`} aria-hidden="true">
                <span>{['✦ ✦', '● ○', 'X O'][index]}</span>
              </div>
              <div className="arcade-card-body">
                <small>{game.tag}</small>
                <h2>{game.title}</h2>
                <p>{game.description}</p>
                <p className="arcade-lock">
                  {unlocked ? (
                    'Freigeschaltet · bleibt verfügbar'
                  ) : (
                    <>
                      <LockKeyhole size={16} aria-hidden="true" /> Noch {game.unlockXP - state.xp}{' '}
                      XP · ab {game.unlockXP} XP
                    </>
                  )}
                </p>
                {!unlocked && (
                  <progress
                    max={game.unlockXP}
                    value={state.xp}
                    aria-label={`Fortschritt zum Freischalten von ${game.title}`}
                  />
                )}
                {records[game.id] && (
                  <small>
                    Runden geschafft: {records[game.id]!.wins}
                    {records[game.id]!.best !== null
                      ? ` · Bestwert: ${records[game.id]!.best} Züge`
                      : ''}
                  </small>
                )}
                <button
                  disabled={!unlocked}
                  onClick={event => {
                    launch.current = event.currentTarget;
                    setActive(game.id);
                    setNotice('');
                  }}
                >
                  {unlocked ? `${game.title} spielen` : `Ab ${game.unlockXP} XP freischaltbar`}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {active && isArcadeUnlocked(active, state.xp) && (
        <div
          className="arcade-game-area"
          key={active}
          ref={player}
          tabIndex={-1}
          aria-label="Aktuelles Arcade-Spiel"
        >
          <div className="arcade-actions">
            <button
              onClick={() => {
                setActive(null);
                setNotice('');
                launch.current?.focus();
              }}
            >
              Spiel schließen
            </button>
          </div>
          <Suspense fallback={<p role="status">Spiel wird geladen …</p>}>
            {active === 'memory' ? (
              <MemoryGame onWin={moves => win('memory', moves)} />
            ) : active === 'lights' ? (
              <LightsGame onWin={moves => win('lights', moves)} />
            ) : (
              <ThreeGame onWin={moves => win('three', moves)} />
            )}
          </Suspense>
        </div>
      )}
      {notice && (
        <p role="status" className="arcade-notice">
          {notice}
        </p>
      )}
      <footer className="arcade-note">
        Spielergebnisse werden kontogetrennt nur in diesem Browser gespeichert. Diese Testversion
        hat kein manipulationssicheres Punktesystem und keine vollständige Gerätesynchronisation.
      </footer>
    </div>
  );
}
