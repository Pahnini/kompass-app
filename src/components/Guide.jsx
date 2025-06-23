
export default function Guide({ onBack }) {
  return (
    <div className="card info-card">
      <button className="back-btn-icon" onClick={onBack} aria-label="Zurück">
  ⬅️ Zurück
</button>
      <h2>
        Psychotherapeut:in finden{" "}
        <span role="img" aria-label="Kompass">
          🧭
        </span>
      </h2>
      <ol>
        <li>
          <span style={{ color: "#12b985", marginRight: 4 }}>🔍</span>
          <b>Online-Suche:</b> Portale wie{" "}
          <a
            href="https://www.therapie.de/psychotherapie/"
            target="_blank"
            rel="noopener noreferrer"
          >
            therapie.de
          </a>{" "}
          oder{" "}
          <a
            href="https://www.kbv.de/html/arztsuche.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            KBV-Arztsuche
          </a>
          .
        </li>
        <li>
          <span style={{ color: "#0b9444", marginRight: 4 }}>📞</span>
          Bei deiner Krankenkasse nachfragen (Hotline, Listen, Beratung).
        </li>
        <li>
          <span style={{ color: "#f90", marginRight: 4 }}>👩‍⚕️</span>
          Direkt Praxen anrufen und nach freien Plätzen & Wartelisten fragen.
        </li>
        <li>
          <span style={{ color: "#cc3366", marginRight: 4 }}>🏥</span>
          Sozialdienst der Klinik um Empfehlungen bitten.
        </li>
        <li>
          <span style={{ color: "#e3342f", marginRight: 4 }}>🚨</span>
          Notfall-Angebote nutzen, wenn schnelle Hilfe nötig ist!
        </li>
      </ol>
      <p style={{ marginTop: 18, color: "#888" }}>
        Sprich immer mit Vertrauenspersonen – und nutze im Zweifel die
        Notfallnummern im Menü{" "}
        <span role="img" aria-label="Notruf">
          🚨
        </span>
        .
      </p>
    </div>
  );
}
