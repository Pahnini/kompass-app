import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { APP_NAME } from '../config/brand';

// Page title mapping
interface PageTitles {
  [key: string]: string;
}

const pageTitles: PageTitles = {
  '/': 'Startseite',
  '/login': 'Anmeldung',
  '/skills': 'Skills & Achtsamkeit',
  '/deinweg': 'Mein Kompass',
  '/designs': 'Designs',
  '/barrierefreiheit': 'Barrierefreiheit',
  '/testen': 'Testen & Feedback',
  '/notfall': 'Notfall & Hilfe',
  '/guide': 'Psychotherapeut:in finden',
  '/nova': 'Nova',
  '/chat': 'Nova',
  '/quickedit': 'Schnellzugriff bearbeiten',
};

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] || 'Seite nicht gefunden';
}

export function usePageTitle(): void {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = `${APP_NAME} – ${pageTitle}`;
  }, [location.pathname]);
}

// Export individual title setter for manual use
export function setPageTitle(title: string): void {
  document.title = title;
}
