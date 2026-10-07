import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MemoryGame from '../MemoryGame';
import LightsGame from '../LightsGame';
import ThreeGame from '../ThreeGame';
import { lightPuzzle, toggleLights } from '../../../utils/arcade';
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe('Arcade game completion', () => {
  it('Memory completes exactly once and a new round can complete independently', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const won = vi.fn();
    render(<MemoryGame onWin={won} />);
    // Build the known test deck independently, then play through the actual accessible buttons.
    const deck = [
      'Sonne',
      'Mond',
      'Stern',
      'Blatt',
      'Wolke',
      'Welle',
      'Sonne',
      'Mond',
      'Stern',
      'Blatt',
      'Wolke',
      'Welle',
    ];
    for (let i = 11; i > 0; i--) [deck[i], deck[0]] = [deck[0], deck[i]];
    for (const symbol of new Set(deck)) {
      for (const index of deck.flatMap((value, index) => (value === symbol ? [index] : [])))
        fireEvent.click(screen.getByRole('button', { name: `Karte ${index + 1}, verdeckt` }));
    }
    expect(won).toHaveBeenCalledOnce();
    expect(won).toHaveBeenCalledWith(6);
    expect(screen.getByText(/Alle sechs Paare/)).toBeTruthy();
    fireEvent.click(screen.getByText('Neue Runde'));
    expect(screen.getByText(/0 von 6 Paaren/)).toBeTruthy();
  });
  it('Lights has working hints and completes without a timer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const won = vi.fn();
    const initial = lightPuzzle(() => 0);
    render(<LightsGame onWin={won} />);
    fireEvent.click(screen.getByText('Tipp anzeigen'));
    expect(screen.getByRole('status').textContent).toContain('Tipp: Feld');
    let solution: number[] = [];
    for (let mask = 1; mask < 512; mask++) {
      let board = [...initial];
      const moves: number[] = [];
      for (let index = 0; index < 9; index++)
        if (mask & (1 << index)) {
          board = toggleLights(board, index);
          moves.push(index);
        }
      if (!board.some(Boolean)) {
        solution = moves;
        break;
      }
    }
    for (const index of solution)
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Feld ${index + 1},`) }));
    expect(won).toHaveBeenCalledOnce();
    expect(screen.getByText(/Rätsel in/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tipp anzeigen' }).hasAttribute('disabled')).toBe(
      true
    );
  });
  it('Three wins once with a fork, does not advance after completion and resets', () => {
    const won = vi.fn();
    render(<ThreeGame onWin={won} />);
    // X: top-left, bottom-right, bottom-left creates a fork against the small deterministic bot.
    for (const index of [0, 8, 6, 7])
      fireEvent.click(screen.getByRole('button', { name: `Feld ${index + 1}, leer` }));
    expect(won).toHaveBeenCalledOnce();
    expect(screen.getByText('Du hast gewonnen!')).toBeTruthy();
    fireEvent.click(screen.getByText('Neue Runde'));
    expect(screen.getAllByRole('button', { name: /leer/ })).toHaveLength(9);
    expect(won).toHaveBeenCalledOnce();
  });
});
