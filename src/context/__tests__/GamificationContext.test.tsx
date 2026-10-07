import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GamificationProvider, useGamification } from '../GamificationContext';
import { dataService } from '../../services/dataService';
const account = vi.hoisted(() => ({ userId: 'alice', points: 0, isLoading: false }));
vi.mock('../../hooks/useUserData', () => ({ useUserData: () => account }));
vi.mock('../../services/dataService', () => ({
  dataService: { setData: vi.fn().mockResolvedValue(undefined) },
}));
function Probe() {
  const { state, record, setEnabled, nextDemoDay, retrySync, status } = useGamification();
  return (
    <>
      <output aria-label="XP">{state.xp}</output>
      <button onClick={() => record('mood', 'example')}>Check-in</button>
      <button onClick={() => setEnabled(false)}>Pause</button>
      <button onClick={nextDemoDay}>Morgen</button>
      <button onClick={retrySync}>Erneut speichern</button>
      <output aria-label="Speicherstatus">{status}</output>
    </>
  );
}
afterEach(cleanup);
beforeEach(() => {
  account.userId = 'alice';
  account.points = 0;
  vi.mocked(dataService.setData).mockResolvedValue(undefined);
});
describe('Shared gamification provider', () => {
  it('keeps offline rewards local and retries once connectivity returns', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    render(
      <GamificationProvider>
        <Probe />
      </GamificationProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
    });
    expect(screen.getByLabelText('XP').textContent).toBe('20');
    expect(screen.getByLabelText('Speicherstatus').textContent).toContain('Offline');
    expect(dataService.setData).not.toHaveBeenCalled();
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    // The shared test setup intercepts network events; invoke the registered callback.
    const listener = vi
      .mocked(window.addEventListener)
      .mock.calls.find(([name]) => name === 'online')?.[1];
    expect(typeof listener).toBe('function');
    await act(async () => {
      if (typeof listener === 'function') listener(new Event('online'));
    });
    expect(dataService.setData).toHaveBeenCalledOnce();
    expect(dataService.setData).toHaveBeenCalledWith('points', 20, 'alice');
    expect(screen.getByLabelText('Speicherstatus').textContent).toBe('');
  });
  it('keeps XP and failure status through unrelated actions and supports retry without new rewards', async () => {
    vi.mocked(dataService.setData).mockRejectedValueOnce(new Error('Offline'));
    render(
      <GamificationProvider>
        <Probe />
      </GamificationProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
    });
    expect(screen.getByLabelText('XP').textContent).toBe('20');
    expect(screen.getByLabelText('Speicherstatus').textContent).toContain('fehlgeschlagen');
    await act(async () => {
      fireEvent.click(screen.getByText('Pause'));
    });
    expect(screen.getByLabelText('Speicherstatus').textContent).toContain('fehlgeschlagen');
    await act(async () => {
      fireEvent.click(screen.getByText('Erneut speichern'));
    });
    expect(screen.getByLabelText('XP').textContent).toBe('20');
    expect(screen.getByLabelText('Speicherstatus').textContent).toBe('');
    expect(dataService.setData).toHaveBeenCalledTimes(2);
    expect(dataService.setData).toHaveBeenLastCalledWith('points', 20, 'alice');
  });
  it('retains simulated days and reward deduplication after demo reload', async () => {
    const view = render(
      <GamificationProvider demo>
        <Probe />
      </GamificationProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
      fireEvent.click(screen.getByText('Morgen'));
      fireEvent.click(screen.getByText('Check-in'));
    });
    view.unmount();
    render(
      <GamificationProvider demo>
        <Probe />
      </GamificationProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
    });
    expect(screen.getByLabelText('XP').textContent).toBe('80');
    expect(dataService.setData).not.toHaveBeenCalled();
  });
  it('does not double-reward or double-save under React StrictMode', async () => {
    render(
      <StrictMode>
        <GamificationProvider>
          <Probe />
        </GamificationProvider>
      </StrictMode>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
      fireEvent.click(screen.getByText('Check-in'));
    });
    expect(screen.getByLabelText('XP').textContent).toBe('20');
    expect(dataService.setData).toHaveBeenCalledTimes(1);
    expect(dataService.setData).toHaveBeenCalledWith('points', 20, 'alice');
  });
  it('isolates demo rewards and simulated days from account writes', async () => {
    render(
      <GamificationProvider demo>
        <Probe />
      </GamificationProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
      fireEvent.click(screen.getByText('Morgen'));
      fireEvent.click(screen.getByText('Check-in'));
    });
    expect(screen.getByLabelText('XP').textContent).toBe('80');
    expect(dataService.setData).not.toHaveBeenCalled();
    expect(localStorage.getItem('melforia_game_v1:alice')).toBeNull();
  });
  it('does not inherit another account or demo state after a switch', async () => {
    const view = render(
      <GamificationProvider key="alice">
        <Probe />
      </GamificationProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
    });
    account.userId = 'bob';
    view.rerender(
      <GamificationProvider key="bob">
        <Probe />
      </GamificationProvider>
    );
    expect(screen.getByLabelText('XP').textContent).toBe('0');
    account.userId = 'alice';
    view.rerender(
      <GamificationProvider key="alice">
        <Probe />
      </GamificationProvider>
    );
    expect(screen.getByLabelText('XP').textContent).toBe('20');
  });
  it('pauses activity tracking and keeps existing XP', async () => {
    render(
      <GamificationProvider demo>
        <Probe />
      </GamificationProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Check-in'));
      fireEvent.click(screen.getByText('Pause'));
      fireEvent.click(screen.getByText('Morgen'));
      fireEvent.click(screen.getByText('Check-in'));
    });
    expect(screen.getByLabelText('XP').textContent).toBe('20');
  });
});
