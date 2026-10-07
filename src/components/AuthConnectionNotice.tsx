import { Link } from 'react-router-dom';
import './AuthConnectionNotice.css';

export default function AuthConnectionNotice() {
  return (
    <section className="auth-connection-notice" role="status" aria-label="Verbindungshinweis">
      <p>
        Die Verbindung zu deinem Konto ist gerade nicht verfügbar. Startseite, Demo und Atemübung
        kannst du trotzdem öffnen. Deine gespeicherten Daten werden nicht gelöscht.
      </p>
      <div>
        <button type="button" onClick={() => window.location.reload()}>
          Erneut laden
        </button>
        <Link to="/demo">Demo öffnen</Link>
        <Link to="/panic">Atemübung öffnen</Link>
      </div>
    </section>
  );
}
