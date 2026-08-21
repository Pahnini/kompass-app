import { BookHeart, Compass, Download, Sparkles, Waves } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_VERSION_LABEL } from '../config/brand';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import './LandingPage.css';

export default function LandingPage(): React.ReactElement {
  const { deferredPrompt, promptInstall } = useInstallPrompt();

  return (
    <div className="melforia-landing">
      <header className="melforia-landing__header">
        <Link to="/" className="melforia-landing__brand">
          <span aria-hidden="true">
            <Compass size={20} />
          </span>
          <strong>{APP_NAME}</strong>
          <small>{APP_VERSION_LABEL}</small>
        </Link>
        <Link to="/testen" className="melforia-landing__test-link">
          Hinweise für Testpersonen
        </Link>
      </header>

      <main className="melforia-landing__main">
        <section className="melforia-landing__copy">
          <p>Dein digitaler Begleiter</p>
          <h1>Ein ruhiger Ort für deinen Alltag.</h1>
          <p>
            Stimmung einordnen, hilfreiche Skills finden und den nächsten kleinen Schritt planen –
            in deinem Tempo.
          </p>
          <div className="melforia-landing__actions">
            <Link to="/login">Melforia öffnen</Link>
            {deferredPrompt && (
              <button type="button" onClick={() => void promptInstall()}>
                <Download size={18} aria-hidden="true" />
                Installieren
              </button>
            )}
          </div>
          <small>Frühe Testversion · keine Therapie und kein Notfalldienst</small>
        </section>

        <div className="melforia-landing__compass" aria-hidden="true">
          <Compass size={90} strokeWidth={1.35} />
        </div>
      </main>

      <nav className="melforia-landing__features" aria-label="Melforia Bereiche">
        <div>
          <Sparkles size={28} aria-hidden="true" />
          <strong>Skills</strong>
          <small>Für schwierige und ruhige Momente</small>
        </div>
        <div>
          <Waves size={28} aria-hidden="true" />
          <strong>Stimmung</strong>
          <small>Kurz wahrnehmen und einordnen</small>
        </div>
        <div>
          <BookHeart size={28} aria-hidden="true" />
          <strong>Mein Weg</strong>
          <small>Gedanken, Ziele und Fortschritte</small>
        </div>
      </nav>

      <footer className="melforia-landing__footer">
        <Link to="/barrierefreiheit">Barrierefreiheit & Vorlesen</Link>
        <span>Bei unmittelbarer Gefahr: 112</span>
      </footer>
    </div>
  );
}
