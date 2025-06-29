import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Page title mapping
interface PageTitles {
  [key: string]: string;
}

const pageTitles: PageTitles = {
  '/': 'KompassApp - Startseite',
  '/skills': 'KompassApp - Skills & Achtsamkeit',
  '/deinweg': 'KompassApp - Mein Kompass',
  '/designs': 'KompassApp - Designs',
  '/notfall': 'KompassApp - Notfall & Hilfe',
  '/guide': 'KompassApp - Psychotherapeut:in finden',
  '/chat': 'KompassApp - Chatbot',
  '/quickedit': 'KompassApp - Schnellzugriff bearbeiten',
};

export function usePageTitle(): void {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitles[location.pathname] || 'KompassApp - Seite nicht gefunden';
    document.title = title;
  }, [location.pathname]);
}

// Export individual title setter for manual use
export function setPageTitle(title: string): void {
  document.title = title;
}
