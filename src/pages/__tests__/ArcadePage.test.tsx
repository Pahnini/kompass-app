import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ArcadePage from '../ArcadePage';
import { GamificationProvider, useGamification } from '../../context/GamificationContext';
import { localDay, newGame } from '../../utils/gamification';
import { memoryDeck } from '../../utils/arcade';
import { dataService } from '../../services/dataService';
const account = vi.hoisted(() => ({ userId: 'alice', points: 120, isLoading: false }));
vi.mock('../../hooks/useUserData', () => ({
  useUserData: () => account,
}));
vi.mock('../../services/dataService', () => ({
  dataService: { setData: vi.fn().mockResolvedValue(undefined) },
}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
function Controls() {
  const { setEnabled } = useGamification();
  return <button onClick={() => setEnabled(false)}>Pausieren</button>;
}
function open(xp = 0) {
  localStorage.setItem('melforia_game_v1:demo', JSON.stringify(newGame(localDay(), xp)));
  return render(
    <MemoryRouter>
      <GamificationProvider demo>
        <Controls />
        <ArcadePage />
      </GamificationProvider>
    </MemoryRouter>
  );
}
describe('Arcade access and persistence', () => {
  it('does not show another account’s arcade records after an account switch', () => {
    account.userId = 'alice';
    localStorage.setItem(
      'melforia_arcade_v1:alice',
      JSON.stringify({ memory: { wins: 3, best: 6 } })
    );
    const view = render(
      <MemoryRouter>
        <GamificationProvider key="alice">
          <ArcadePage />
        </GamificationProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Runden geschafft: 3/)).toBeTruthy();
    account.userId = 'bob';
    view.rerender(
      <MemoryRouter>
        <GamificationProvider key="bob">
          <ArcadePage />
        </GamificationProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText(/Runden geschafft:/)).toBeNull();
    account.userId = 'alice';
  });
  it('locks all games below thresholds and points are not spent when opening one', async () => {
    open(0);
    expect(
      screen.getByRole('button', { name: 'Ab 20 XP freischaltbar' }).hasAttribute('disabled')
    ).toBe(true);
    expect(
      screen.getByRole('button', { name: 'Ab 60 XP freischaltbar' }).hasAttribute('disabled')
    ).toBe(true);
    expect(
      screen.getByRole('button', { name: 'Ab 120 XP freischaltbar' }).hasAttribute('disabled')
    ).toBe(true);
  });
  it('records exactly one completed demo round, keeps XP and permits already unlocked games while paused', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const deck = memoryDeck(() => 0);
    open(120);
    fireEvent.click(screen.getByText('Pausieren'));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Orbit Memory spielen' }));
    });
    for (const symbol of new Set(deck))
      for (const index of deck.flatMap((value, index) => (value === symbol ? [index] : [])))
        fireEvent.click(
          await screen.findByRole('button', { name: `Karte ${index + 1}, verdeckt` })
        );
    expect(JSON.parse(localStorage.getItem('melforia_arcade_v1:demo')!).memory).toEqual({
      wins: 1,
      best: 6,
    });
    expect(localStorage.getItem('melforia_arcade_v1:alice')).toBeNull();
    expect(JSON.parse(localStorage.getItem('melforia_game_v1:demo')!).xp).toBe(120);
    expect(dataService.setData).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Spiel schließen'));
    expect(document.activeElement?.textContent).toBe('Orbit Memory spielen');
    expect(screen.getByText(/Runden geschafft: 1/)).toBeTruthy();
  });
});
