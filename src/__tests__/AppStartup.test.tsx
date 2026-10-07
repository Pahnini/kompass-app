import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

const startup = vi.hoisted(() => ({ session: null, loading: true, connectionIssue: false }));
vi.mock('../hooks/useStartupSession', () => ({ useStartupSession: () => startup }));
vi.mock('../hooks/usePageTitle', () => ({ usePageTitle: () => {} }));
const ui = vi.hoisted(() => ({ setShowWelcome: vi.fn() }));
vi.mock('../hooks/useUI', () => ({ useUI: () => ui }));
vi.mock('../components/GlobalStyle', () => ({ default: () => null }));
vi.mock('../components/accessibility/AccessibilityToolbar', () => ({ default: () => null }));
vi.mock('../components/accessibility/RouteAnnouncer', () => ({ default: () => null }));
vi.mock('../components/OfflineToast', () => ({ default: () => null }));
vi.mock('../components/UpdateToast', () => ({ default: () => null }));
vi.mock('../components/InstallPromptBanner', () => ({ default: () => null }));
vi.mock('../components/ui/SmartLoading', () => ({
  default: ({ message }: { message: string }) => <p>{message}</p>,
}));
vi.mock('../pages/LandingPage', () => ({ default: () => <h1>Öffentliche Startseite</h1> }));
vi.mock('../pages/LoginPage', () => ({ default: () => <h1>Anmelden</h1> }));
vi.mock('../views/PanicScreen', () => ({ default: () => <h1>Atemübung</h1> }));

afterEach(cleanup);
beforeEach(() => {
  startup.loading = true;
  startup.connectionIssue = false;
});
function open(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('App access while authentication is unavailable', () => {
  it('opens the landing page immediately during a pending refresh', () => {
    open('/');
    expect(screen.getByRole('heading', { name: 'Öffentliche Startseite' })).toBeDefined();
    expect(screen.queryByText('Verbindung wird hergestellt...')).toBeNull();
  });
  it('opens the login page without waiting for session refresh', () => {
    open('/login');
    expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeDefined();
  });
  it('keeps the breathing screen free of auth loading and error banners', () => {
    startup.connectionIssue = true;
    open('/panic');
    expect(screen.getByRole('heading', { name: 'Atemübung' })).toBeDefined();
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('does not expose private screens while the session is unresolved', () => {
    open('/goals');
    expect(screen.getByText('Verbindung wird hergestellt...')).toBeDefined();
    expect(screen.queryByRole('heading')).toBeNull();
  });
  it('shows public fallback and useful actions when startup times out', () => {
    startup.loading = false;
    startup.connectionIssue = true;
    open('/goals');
    expect(screen.getByRole('heading', { name: 'Öffentliche Startseite' })).toBeDefined();
    expect(screen.getByRole('status', { name: 'Verbindungshinweis' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Atemübung öffnen' }).getAttribute('href')).toBe(
      '/panic'
    );
    expect(screen.getByRole('button', { name: 'Erneut laden' })).toBeDefined();
  });
});
