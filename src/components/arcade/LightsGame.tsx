import { useRef, useState } from 'react';
import { lightPuzzle, toggleLights } from '../../utils/arcade';
export default function LightsGame({ onWin }: { onWin: (moves: number) => void }) {
  const [board, setBoard] = useState(lightPuzzle);
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState<number | null>(null);
  const finished = useRef(false);
  const won = !board.some(Boolean);
  const move = (index: number) => {
    if (finished.current) return;
    const next = toggleLights(board, index);
    setBoard(next);
    setHint(null);
    setMoves(moves + 1);
    if (!next.some(Boolean)) {
      finished.current = true;
      onWin(moves + 1);
    }
  };
  const showHint = () => {
    for (let mask = 1; mask < 512; mask++) {
      let next = [...board];
      const path: number[] = [];
      for (let cell = 0; cell < 9; cell++)
        if (mask & (1 << cell)) {
          next = toggleLights(next, cell);
          path.push(cell);
        }
      if (!next.some(Boolean)) {
        setHint(path[0]);
        return;
      }
    }
  };
  return (
    <section className="arcade-player" aria-label="Lichter aus">
      <h2>Lichter aus</h2>
      <p>
        Tippe ein Feld an: Es und seine direkten Nachbarn wechseln zwischen an und aus. Das Ziel:
        alle Lichter aus. Ohne Countdown.
      </p>
      <p role="status">
        {won
          ? `Rätsel in ${moves} Zügen gelöst!`
          : `${moves} Züge${hint !== null ? ` · Tipp: Feld ${hint + 1}` : ''}`}
      </p>
      <div className="arcade-board three-board" role="group" aria-label="Neun Lichter">
        {board.map((on, index) => (
          <button
            key={index}
            aria-label={`Feld ${index + 1}, ${on ? 'an' : 'aus'}`}
            aria-pressed={on}
            disabled={won}
            className={`${on ? 'is-lit' : ''} ${hint === index ? 'is-hint' : ''}`}
            onClick={() => move(index)}
          >
            <span aria-hidden="true">{on ? '●' : '○'}</span>
            <small>
              {index + 1} · {on ? 'An' : 'Aus'}
            </small>
          </button>
        ))}
      </div>
      <div className="arcade-actions">
        <button disabled={won} onClick={showHint}>
          Tipp anzeigen
        </button>
        <button
          onClick={() => {
            setBoard(lightPuzzle());
            setMoves(0);
            setHint(null);
            finished.current = false;
          }}
        >
          Neues Rätsel
        </button>
      </div>
    </section>
  );
}
