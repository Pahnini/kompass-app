import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { APP_NAME } from '../../config/brand';
import { getPageTitle } from '../../hooks/usePageTitle';
import { useAccessibility } from '../../hooks/useAccessibility';

export default function RouteAnnouncer(): React.ReactElement {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');
  const { stopSpeaking } = useAccessibility();

  useEffect(() => {
    stopSpeaking();
    setAnnouncement('');
    const timer = window.setTimeout(() => {
      setAnnouncement(`${APP_NAME}: ${getPageTitle(location.pathname)} geladen.`);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.pathname, stopSpeaking]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
}
