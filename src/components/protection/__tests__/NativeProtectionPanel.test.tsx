import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROTECTION_SETTINGS } from '../../../utils/protection';
import NativeProtectionPanel from '../NativeProtectionPanel';

const bridge = vi.hoisted(() => ({
  getState: vi.fn(),
  configure: vi.fn(),
  acceptDisclosure: vi.fn(),
  openAccessibilitySettings: vi.fn(),
  setEnabled: vi.fn(),
}));
vi.mock('../../../native/protectionBridge', () => ({
  isNativeProtectionAvailable: () => true,
  NativeProtection: bridge,
}));
const base = () => ({
  enabled: false,
  serviceEnabled: false,
  connected: true,
  consentVersion: 0,
  config: structuredClone(DEFAULT_PROTECTION_SETTINGS),
  entries: [],
});
beforeEach(() => {
  vi.clearAllMocks();
  bridge.getState.mockResolvedValue(base());
  bridge.openAccessibilitySettings.mockResolvedValue(undefined);
  bridge.configure.mockResolvedValue(base());
  bridge.acceptDisclosure.mockResolvedValue({ ...base(), consentVersion: 1 });
});
afterEach(cleanup);

describe('explicit Android activation', () => {
  it('requires disclosure before opening settings and never starts the service automatically', async () => {
    const user = userEvent.setup();
    render(<NativeProtectionPanel settings={DEFAULT_PROTECTION_SETTINGS} />);
    const permission = await screen.findByRole('button', { name: 'Android-Berechtigung öffnen' });
    await waitFor(() => expect(screen.getByText('Android-Berechtigung fehlt')).toBeDefined());
    expect((permission as HTMLButtonElement).disabled).toBe(true);
    await user.click(
      screen.getByRole('checkbox', {
        name: /Ich möchte diesen optionalen Bildschirmzugriff erlauben/,
      })
    );
    await user.click(permission);
    expect(bridge.acceptDisclosure).toHaveBeenCalledWith({ version: 1 });
    expect(bridge.openAccessibilitySettings).toHaveBeenCalledTimes(1);
    expect(bridge.setEnabled).not.toHaveBeenCalled();
  });
  it('does not claim activation or start inspection when configuration fails', async () => {
    bridge.getState.mockResolvedValue({ ...base(), consentVersion: 1, serviceEnabled: true });
    bridge.configure.mockRejectedValue(new Error('write failed'));
    const user = userEvent.setup();
    render(<NativeProtectionPanel settings={DEFAULT_PROTECTION_SETTINGS} />);
    const start = await screen.findByRole('button', { name: 'Android-Schutz starten' });
    await waitFor(() => expect((start as HTMLButtonElement).disabled).toBe(false));
    await user.click(start);
    expect(bridge.setEnabled).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/Die Android-Aktion konnte nicht abgeschlossen werden/)
    ).toBeDefined();
    expect(screen.queryByText('Android-Schutz ist eingeschaltet')).toBeNull();
  });
});
