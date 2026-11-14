import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectionPage from '../ProtectionPage';
import { PROTECTION_STORAGE_KEY, DEFAULT_PROTECTION_SETTINGS } from '../../utils/protection';

vi.mock('../../hooks/useTheme', () => ({ useTheme: () => ({ theme: { dark: false } }) }));
vi.mock('../../native/protectionBridge', () => ({
  isNativeProtectionAvailable: () => false,
  NativeProtection: {},
}));
beforeEach(() => {
  localStorage.clear();
});
afterEach(cleanup);
function open() {
  return render(
    <MemoryRouter>
      <ProtectionPage />
    </MemoryRouter>
  );
}

describe('Melforia digital protection', () => {
  it('keeps existing entries when automatic collection reaches capacity', () => {
    const entries = Array.from({ length: 199 }, (_, i) => ({
      id: `old-${i}`,
      text: `Gesicherter Test ${i}`,
      category: 'manual',
      source: 'manual',
      capturedAt: '2026-11-14T12:00:00Z',
    }));
    localStorage.setItem(
      PROTECTION_STORAGE_KEY,
      JSON.stringify({
        settings: { ...DEFAULT_PROTECTION_SETTINGS, autoCollect: true },
        entries,
        dismissedExampleIds: [],
      })
    );
    open();
    const saved = JSON.parse(localStorage.getItem(PROTECTION_STORAGE_KEY)!);
    expect(saved.entries).toHaveLength(200);
    expect(
      saved.entries.filter((entry: { id: string }) => entry.id.startsWith('old-'))
    ).toHaveLength(199);
  });
  it('conceals attacks until explicitly revealed and keeps ordinary criticism visible', async () => {
    const user = userEvent.setup();
    open();
    expect(screen.queryByText('Frauen haben in diesem Sport nichts verloren.')).toBeNull();
    expect(
      screen.getByText(
        'Ich sehe das anders: Nicht jede Pause löst Stress. Aber schön, dass es dir hilft.'
      )
    ).toBeDefined();
    await user.click(
      screen.getByRole('button', { name: 'Kommentar von beispielprofil_27 anzeigen' })
    );
    expect(screen.getByText('Frauen haben in diesem Sport nichts verloren.')).toBeDefined();
    await user.click(screen.getByRole('button', { name: 'Wieder verdecken' }));
    expect(screen.queryByText('Frauen haben in diesem Sport nichts verloren.')).toBeNull();
  });
  it('stores only explicitly chosen examples by default and hides collected originals', async () => {
    const user = userEvent.setup();
    open();
    expect(localStorage.getItem(PROTECTION_STORAGE_KEY)).toBeNull();
    await user.click(
      screen.getByRole('button', { name: 'Kommentar von beispielprofil_27 sichern' })
    );
    const saved = JSON.parse(localStorage.getItem(PROTECTION_STORAGE_KEY)!);
    expect(saved.entries).toHaveLength(1);
    expect(saved.entries[0].source).toBe('example');
    await user.click(screen.getByRole('button', { name: 'Sammlung (1)' }));
    expect(screen.queryByText('Frauen haben in diesem Sport nichts verloren.')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Text anzeigen' }));
    expect(screen.getByText('Frauen haben in diesem Sport nichts verloren.')).toBeDefined();
  });
  it('does not recreate a removed automatically collected example after reopening', async () => {
    const user = userEvent.setup();
    const view = open();
    await user.click(
      screen.getByRole('checkbox', { name: /Verdeckte Beispiele automatisch sammeln/ })
    );
    await user.click(screen.getByRole('button', { name: 'Sammlung (3)' }));
    const entry = screen.getByText('Sexismus').closest('article')!;
    await user.click(within(entry).getByRole('button', { name: /löschen/ }));
    expect(screen.getByRole('button', { name: 'Sammlung (2)' })).toBeDefined();
    view.unmount();
    open();
    await user.click(screen.getByRole('button', { name: 'Sammlung (2)' }));
    expect(screen.queryByText('Sexismus')).toBeNull();
  });
  it('offers no native permission or activation controls in a browser', () => {
    open();
    expect(screen.getByText(/Eine installierte PWA allein/)).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Android-Schutz starten' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Android-Berechtigung öffnen' })).toBeNull();
  });
});
