import {
  Accessibility,
  ArrowRight,
  BookHeart,
  Bot,
  CheckCircle2,
  Compass,
  Download,
  MessageSquareText,
  Mic2,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_VERSION_LABEL } from '../config/brand';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import './LandingPage.css';

const featureCards = [
  {
    icon: Mic2,
    title: 'Kurze Gedanken',
    description:
      'Sprich oder tippe eine Notiz und entscheide erst danach, ob du sie speichern möchtest.',
  },
  {
    icon: Sparkles,
    title: 'Skills',
    description: 'Finde kleine, alltagstaugliche Übungen für unterschiedliche Situationen.',
  },
  {
    icon: Waves,
    title: 'Stimmung',
    description: 'Nimm kurz wahr, wie es dir geht, ohne dich erklären oder bewerten zu müssen.',
  },
  {
    icon: BookHeart,
    title: 'Mein Weg',
    description: 'Halte Gedanken, Ziele und kleine Fortschritte an einem ruhigen Ort fest.',
  },
];

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

        <nav aria-label="Seitennavigation">
          <a href="#funktionen">Funktionen</a>
          <a href="#sicherheit">Sicherheit</a>
          <Link to="/testen#feedback">Feedback</Link>
        </nav>

        <Link to="/login" className="melforia-landing__login">
          Anmelden
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <div className="melforia-landing__content">
        <section className="melforia-landing__main">
          <div className="melforia-landing__copy">
            <p>Dein digitaler Begleiter</p>
            <h1>Ein ruhiger Ort für deinen Alltag.</h1>
            <p>
              Gedanken festhalten, Stimmung einordnen, hilfreiche Skills finden und den nächsten
              kleinen Schritt planen – in deinem Tempo.
            </p>
            <div className="melforia-landing__actions">
              <Link to="/login">
                {APP_NAME} öffnen
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/testen" className="is-secondary">
                Testen & Feedback
              </Link>
              {deferredPrompt && (
                <button type="button" onClick={() => void promptInstall()}>
                  <Download size={18} aria-hidden="true" />
                  Installieren
                </button>
              )}
            </div>
            <small>
              Frühe Testversion · keine Therapie, kein Medizinprodukt und kein Notfalldienst
            </small>
          </div>

          <div className="melforia-landing__visual" aria-hidden="true">
            <div className="melforia-landing__compass">
              <Compass size={90} strokeWidth={1.35} />
            </div>
            <span>Wahrnehmen</span>
            <span>Sortieren</span>
            <span>Weitergehen</span>
          </div>
        </section>

        <section id="funktionen" className="melforia-landing__section">
          <div className="melforia-landing__section-heading">
            <p>Was dich erwartet</p>
            <h2>Kleine Werkzeuge statt großer Versprechen.</h2>
            <span>
              Du entscheidest selbst, welchen Bereich du öffnest und welche Inhalte du speichern
              möchtest.
            </span>
          </div>
          <div className="melforia-landing__features">
            {featureCards.map(card => {
              const Icon = card.icon;
              return (
                <article key={card.title}>
                  <Icon size={27} aria-hidden="true" />
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="melforia-landing__steps" aria-labelledby="landing-steps-heading">
          <div className="melforia-landing__section-heading">
            <p>So beginnt dein Test</p>
            <h2 id="landing-steps-heading">In drei überschaubaren Schritten.</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Testkonto anlegen</strong>
                <p>
                  Registriere dich mit E-Mail und Passwort oder nutze ein vorbereitetes Testkonto.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Bereiche ausprobieren</strong>
                <p>
                  Nutze harmlose Beispiele und teste nur die Funktionen, die dich interessieren.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Rückmeldung geben</strong>
                <p>Bewerte Bedienung und Bereiche und beschreibe, was wir verbessern sollten.</p>
              </div>
            </li>
          </ol>
        </section>

        <section id="sicherheit" className="melforia-landing__trust">
          <div>
            <ShieldCheck size={30} aria-hidden="true" />
            <div>
              <p>Sicherheit & Transparenz</p>
              <h2>Du behältst die Entscheidung.</h2>
            </div>
          </div>
          <ul>
            <li>
              <CheckCircle2 aria-hidden="true" /> Keine gespeicherten Audioaufnahmen
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> Nova-Chat wird in Test 0.1 nicht gespeichert
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> Keine Diagnosen oder autonome Therapie
            </li>
            <li>
              <Accessibility aria-hidden="true" /> Vorlesen und Bedienhilfen integriert
            </li>
          </ul>
        </section>

        <section className="melforia-landing__assistant">
          <span aria-hidden="true">
            <Bot size={32} />
          </span>
          <div>
            <p>Digitale Begleitung im Testmodus</p>
            <h2>Orientierung in der App – klar begrenzt und transparent.</h2>
            <span>
              Die Begleitung nutzt derzeit geprüfte, regelbasierte Antworten. Sie ist keine
              Therapeutin, stellt keine Diagnosen und ersetzt keine persönliche Hilfe.
            </span>
          </div>
        </section>

        <section className="melforia-landing__feedback" aria-labelledby="landing-feedback-heading">
          <MessageSquareText size={34} aria-hidden="true" />
          <div>
            <p>Gemeinsam verbessern</p>
            <h2 id="landing-feedback-heading">Dein Feedback prägt die nächste Version.</h2>
            <span>
              Wähle die betroffenen Bereiche aus, vergib eine Bewertung und teile uns mit, wo du
              nicht weitergekommen bist.
            </span>
          </div>
          <Link to="/testen#feedback">
            Feedback geben
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>

      <footer className="melforia-landing__footer">
        <div>
          <strong>{APP_NAME}</strong>
          <span>Frühe Testversion für Alltag, Selbstorganisation und Reflexion.</span>
        </div>
        <nav aria-label="Weitere Informationen">
          <Link to="/barrierefreiheit">Barrierefreiheit & Vorlesen</Link>
          <Link to="/testen">Testhinweise</Link>
        </nav>
        <span>Bei unmittelbarer Gefahr: 112</span>
      </footer>
    </div>
  );
}
