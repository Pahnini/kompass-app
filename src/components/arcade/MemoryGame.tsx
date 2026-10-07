import { useRef, useState } from 'react';
import { memoryDeck } from '../../utils/arcade';

const symbols: Record<string, string> = {
  Sonne: '☀',
  Mond: '☾',
  Stern: '✦',
  Blatt: '❧',
  Wolke: '☁',
  Welle: '≈',
};
export default function MemoryGame({ onWin }: { onWin: (moves: number) => void }) {
  const [deck, setDeck] = useState(memoryDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const finished = useRef(false);
  const won = matched.length === deck.length;
  const pick = (index: number) => {
    if (
      finished.current ||
      selected.length === 2 ||
      selected.includes(index) ||
      matched.includes(index)
    )
      return;
    const next = [...selected, index];
    setSelected(next);
    if (next.length !== 2) return;
    const turn = moves + 1;
    setMoves(turn);
    if (deck[next[0]] === deck[next[1]]) {
      const pairs = [...matched, ...next];
      setMatched(pairs);
      setSelected([]);
      if (pairs.length === deck.length) {
        finished.current = true;
        onWin(turn);
      }
    }
  };
  return (
    <section className="arcade-player" aria-label="Orbit Memory">
      <h2>Orbit Memory</h2>
      <p>
        Decke zwei Karten auf. Gleiche Symbole bleiben offen. Bei verschiedenen Symbolen
        entscheidest du selbst, wann es weitergeht.
      </p>
      <p role="status">
        {won
          ? 'Alle sechs Paare gefunden. Gut gespielt!'
          : selected.length === 2
            ? 'Noch kein Paar. Schau in Ruhe – dann drücke Weiter.'
            : `${matched.length / 2} von 6 Paaren · ${moves} Züge`}
      </p>
      <div className="arcade-board memory-board" role="group" aria-label="Zwölf Memory-Karten">
        {deck.map((symbol, index) => {
          const open = selected.includes(index) || matched.includes(index);
          return (
            <button
              key={index}
              aria-label={`Karte ${index + 1}, ${open ? symbol : 'verdeckt'}${matched.includes(index) ? ', gefunden' : ''}`}
              className={open ? 'is-open' : ''}
              disabled={won || selected.length === 2 || open}
              onClick={() => pick(index)}
            >
              <span aria-hidden="true">{open ? symbols[symbol] : '·'}</span>
            </button>
          );
        })}
      </div>
      <div className="arcade-actions">
        {selected.length === 2 && <button onClick={() => setSelected([])}>Weiter</button>}
        <button
          onClick={() => {
            setDeck(memoryDeck());
            setSelected([]);
            setMatched([]);
            setMoves(0);
            finished.current = false;
          }}
        >
          Neue Runde
        </button>
      </div>
    </section>
  );
}
