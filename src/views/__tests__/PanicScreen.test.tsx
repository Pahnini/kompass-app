import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PanicScreen from '../PanicScreen';
import PanicButton from '../../components/shared/PanicButton';
import EmergencyPage from '../../pages/EmergencyPage';
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe('Breathing support without direct calling', () => {
  it('does not expose telephone links in the breathing exercise', () => {
    const view = render(
      <MemoryRouter>
        <PanicScreen />
      </MemoryRouter>
    );
    expect(view.container.querySelector('a[href^="tel:"]')).toBeNull();
    expect(screen.getByRole('button', { name: 'panic.moreHelp' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'panic.pause' })).toBeTruthy();
  });
  it('uses only an exclamation mark while preserving its accessible name', () => {
    render(
      <MemoryRouter>
        <PanicButton />
      </MemoryRouter>
    );
    const button = screen.getByRole('button', { name: 'panic.buttonLabel' });
    expect(button.textContent).toBe('!');
    expect(button.getAttribute('title')).toBe('panic.buttonLabel');
  });
  it('retains the five-second delay and explicit confirmation before help contacts', () => {
    vi.useFakeTimers();
    const view = render(
      <MemoryRouter>
        <EmergencyPage helpResources={[]} />
      </MemoryRouter>
    );
    expect(view.container.querySelector('a[href^="tel:"]')).toBeNull();
    const button = screen.getByRole('button', { name: /Noch 5s/ });
    expect(button.hasAttribute('disabled')).toBe(true);
    // Advance individual ticks because the existing countdown schedules one timeout per render.
    for (let index = 0; index < 4; index++)
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    expect(view.container.querySelector('a[href^="tel:"]')).toBeNull();
    expect(screen.getByRole('button', { name: /Noch 1s/ }).hasAttribute('disabled')).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const confirm = screen.getByRole('button', { name: /Trotzdem Notfall öffnen/ });
    expect(confirm.hasAttribute('disabled')).toBe(false);
    expect(view.container.querySelector('a[href^="tel:"]')).toBeNull();
    fireEvent.click(confirm);
    expect(view.container.querySelector('a[href="tel:112"]')).not.toBeNull();
  });
});
