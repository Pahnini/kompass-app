import { useRef, useState } from 'react';
import { computerMove, threeResult, type Mark } from '../../utils/arcade';
export default function ThreeGame({ onWin }: { onWin: (moves: number) => void }) {
  const [board, setBoard] = useState<Mark[]>(Array<Mark>(9).fill(null));
  const finished = useRef(false);
  const result = threeResult(board);
  const move = (index: number) => {
    if (finished.current || board[index]) return;
    const next = [...board];
    next[index] = 'X';
    const first = threeResult(next);
    if (!first) {
      const cell = computerMove(next);
      if (cell !== null) next[cell] = 'O';
    }
    setBoard(next);
    const end = threeResult(next);
    if (end) {
      finished.current = true;
      if (end === 'X') onWin(next.filter(mark => mark === 'X').length);
    }
  };
  return (
    <section className="arcade-player" aria-label="Drei gewinnt">
      <h2>Drei gewinnt</h2>
      <p>
        Du bist X, der Computer ist O. Drei gleiche Zeichen in einer Reihe gewinnen. Ein
        Unentschieden oder eine Niederlage kostet keine XP.
      </p>
      <p role="status">
        {result === 'X'
          ? 'Du hast gewonnen!'
          : result === 'O'
            ? 'Diese Runde geht an den Computer. Lust auf eine neue?'
            : result === 'draw'
              ? 'Unentschieden – gut gespielt.'
              : 'Du bist dran. Wähle ein leeres Feld.'}
      </p>
      <div className="arcade-board three-board" role="group" aria-label="Drei-gewinnt-Spielfeld">
        {board.map((mark, index) => (
          <button
            key={index}
            aria-label={`Feld ${index + 1}, ${mark ?? 'leer'}`}
            disabled={Boolean(result) || Boolean(mark)}
            onClick={() => move(index)}
          >
            {mark ?? '·'}
          </button>
        ))}
      </div>
      <div className="arcade-actions">
        <button
          onClick={() => {
            setBoard(Array<Mark>(9).fill(null));
            finished.current = false;
          }}
        >
          Neue Runde
        </button>
      </div>
    </section>
  );
}
