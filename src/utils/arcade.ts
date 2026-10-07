export const ARCADE_GAMES = [
  {
    id: 'memory',
    title: 'Orbit Memory',
    unlockXP: 20,
    description: 'Finde sechs Symbolpaare. Ohne Zeitlimit.',
    tag: 'Merken & entdecken',
  },
  {
    id: 'lights',
    title: 'Lichter aus',
    unlockXP: 60,
    description: 'Schalte alle neun Lichter aus. Jeder Zug verändert Nachbarfelder.',
    tag: 'Knobeln',
  },
  {
    id: 'three',
    title: 'Drei gewinnt',
    unlockXP: 120,
    description: 'Eine kurze Runde gegen den Computer. Du spielst X.',
    tag: 'Strategie',
  },
] as const;
export type ArcadeId = (typeof ARCADE_GAMES)[number]['id'];
export function isArcadeUnlocked(id: ArcadeId, xp: number): boolean {
  return Number.isFinite(xp) && xp >= ARCADE_GAMES.find(game => game.id === id)!.unlockXP;
}
export function shuffle<T>(values: readonly T[], random = Math.random): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const next = Math.min(index, Math.max(0, Math.floor(random() * (index + 1))));
    [result[index], result[next]] = [result[next], result[index]];
  }
  return result;
}
export const MEMORY_SYMBOLS = ['Sonne', 'Mond', 'Stern', 'Blatt', 'Wolke', 'Welle'] as const;
export function memoryDeck(random = Math.random): string[] {
  return shuffle([...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS], random);
}
export function toggleLights(board: readonly boolean[], index: number): boolean[] {
  if (board.length !== 9 || index < 0 || index > 8 || !Number.isInteger(index)) return [...board];
  const row = Math.floor(index / 3),
    column = index % 3;
  return board.map((on, cell) => {
    const distance = Math.abs(Math.floor(cell / 3) - row) + Math.abs((cell % 3) - column);
    return distance <= 1 ? !on : on;
  });
}
export function lightPuzzle(random = Math.random): boolean[] {
  let board = Array<boolean>(9).fill(false);
  // Generated from the solved board: every puzzle has a solution.
  for (const move of shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], random).slice(0, 4))
    board = toggleLights(board, move);
  return board.some(Boolean) ? board : toggleLights(board, 4);
}
export type Mark = 'X' | 'O' | null;
export function threeResult(board: readonly Mark[]): 'X' | 'O' | 'draw' | null {
  for (const [a, b, c] of [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? 'draw' : null;
}
export function computerMove(board: readonly Mark[]): number | null {
  if (threeResult(board)) return null;
  const empty = board.flatMap((mark, index) => (mark ? [] : [index]));
  for (const mark of ['O', 'X'] as const) {
    for (const index of empty) {
      const next = [...board];
      next[index] = mark;
      if (threeResult(next) === mark) return index;
    }
  }
  return [4, 0, 2, 6, 8, 1, 3, 5, 7].find(index => !board[index]) ?? null;
}
export type ArcadeRecords = Partial<Record<ArcadeId, { wins: number; best: number | null }>>;
export const EMPTY_ARCADE_RECORDS: ArcadeRecords = {};
export function validateArcadeRecords(value: unknown): ArcadeRecords {
  if (!value || typeof value !== 'object') return {};
  const result: ArcadeRecords = {};
  for (const game of ARCADE_GAMES) {
    const record = (value as Record<string, unknown>)[game.id];
    if (!record || typeof record !== 'object') continue;
    const row = record as Record<string, unknown>;
    if (typeof row.wins !== 'number' || !Number.isSafeInteger(row.wins) || row.wins < 0) continue;
    result[game.id] = {
      wins: Math.min(row.wins, 1_000_000),
      best:
        typeof row.best === 'number' && Number.isSafeInteger(row.best) && row.best > 0
          ? row.best
          : null,
    };
  }
  return result;
}
