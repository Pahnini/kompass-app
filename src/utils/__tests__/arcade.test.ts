import { describe, expect, it } from 'vitest';
import {
  ARCADE_GAMES,
  computerMove,
  isArcadeUnlocked,
  lightPuzzle,
  memoryDeck,
  MEMORY_SYMBOLS,
  threeResult,
  toggleLights,
  validateArcadeRecords,
} from '../arcade';
describe('Arcade rewards and game rules', () => {
  it('uses permanent thresholds, without spending XP', () => {
    for (const game of ARCADE_GAMES) {
      expect(isArcadeUnlocked(game.id, game.unlockXP - 1)).toBe(false);
      expect(isArcadeUnlocked(game.id, game.unlockXP)).toBe(true);
      expect(isArcadeUnlocked(game.id, 10_000)).toBe(true);
    }
    expect(isArcadeUnlocked('memory', NaN)).toBe(false);
  });
  it('creates exactly six pairs with twelve cards', () => {
    const deck = memoryDeck();
    expect(deck).toHaveLength(12);
    for (const symbol of MEMORY_SYMBOLS)
      expect(deck.filter(value => value === symbol)).toHaveLength(2);
    expect(memoryDeck(() => 0)).toEqual(memoryDeck(() => 0));
  });
  it('toggles neighbours without wrapping rows and undoing a move restores the board', () => {
    const board = Array<boolean>(9).fill(false);
    expect(toggleLights(board, 2)).toEqual([
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
    ]);
    expect(toggleLights(toggleLights(board, 4), 4)).toEqual(board);
    expect(board.some(Boolean)).toBe(false);
  });
  it('generates non-empty solvable puzzles', () => {
    for (const random of [() => 0, () => 0.25, () => 0.5, () => 0.99]) {
      const board = lightPuzzle(random);
      expect(board.some(Boolean)).toBe(true);
      let solvable = false;
      for (let mask = 0; mask < 512; mask++) {
        let candidate = [...board];
        for (let cell = 0; cell < 9; cell++)
          if (mask & (1 << cell)) candidate = toggleLights(candidate, cell);
        if (!candidate.some(Boolean)) {
          solvable = true;
          break;
        }
      }
      expect(solvable).toBe(true);
    }
  });
  it('recognizes rows, diagonals, draws and unfinished games', () => {
    expect(threeResult(['X', 'X', 'X', null, null, null, null, null, null])).toBe('X');
    expect(threeResult(['O', null, null, null, 'O', null, null, null, 'O'])).toBe('O');
    expect(threeResult(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])).toBe('draw');
    expect(threeResult(Array(9).fill(null))).toBeNull();
  });
  it('computer completes wins, blocks immediate losses and never overwrites a cell', () => {
    expect(computerMove(['O', 'O', null, 'X', 'X', null, null, null, null])).toBe(2);
    expect(computerMove(['X', 'X', null, null, 'O', null, null, null, null])).toBe(2);
    expect(computerMove(['X', null, null, null, null, null, null, null, null])).toBe(4);
    expect(computerMove(['X', 'X', 'X', null, null, null, null, null, null])).toBeNull();
  });
  it('validates browser records and ignores unknown games or invalid wins', () => {
    expect(
      validateArcadeRecords({
        memory: { wins: 2, best: 8 },
        lights: { wins: -1, best: 0 },
        hacked: { wins: 10 },
      })
    ).toEqual({ memory: { wins: 2, best: 8 } });
    expect(validateArcadeRecords(null)).toEqual({});
  });
});
