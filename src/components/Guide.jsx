import BackButton from "./BackButton";

export default function Guide() {
  return (
    <div className="card">
<<<<<<< HEAD
      <BackButton />
=======
      <BackButton onClick={onBack} />
>>>>>>> 40c7e75 (Refactor components: replace back button implementation in DeinWeg, Guide, and Skills with BackButton component; add DeleteButton component for improved delete functionality and UI consistency.)
      <h2>
        Psychotherapeut:in finden{" "}
        <span role="img" aria-label="Kompass">
          🧭
        </span>
      </h2>
      <ul>
        <li>
          <span style={{ marginRight: 4 }}>🔍</span>
<<<<<<< HEAD
          <div>
            <b>Online-Suche:</b> Nutze diese Portale:
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <a
                href="https://www.therapie.de/psychotherapie/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#abebc6", display: "block" }}
              >
                → therapie.de
              </a>
              <a
                href="https://www.kbv.de/html/arztsuche.php"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#abebc6", display: "block" }}
              >
                → KBV-Arztsuche
              </a>
            </div>
          </div>
=======
          <b>Online-Suche:</b> Portale wie{" "}
          <a
            href="https://www.therapie.de/psychotherapie/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#abebc6" }}
          >
            therapie.de
          </a>{" "}
          oder{" "}
          <a
            href="https://www.kbv.de/html/arztsuche.php"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#abebc6" }}
          >
            KBV-Arztsuche
          </a>
          .
>>>>>>> 40c7e75 (Refactor components: replace back button implementation in DeinWeg, Guide, and Skills with BackButton component; add DeleteButton component for improved delete functionality and UI consistency.)
        </li>
        <li>
          <span style={{ marginRight: 4 }}>📞</span>
          Bei deiner Krankenkasse nachfragen (Hotline, Listen, Beratung).
        </li>
        <li>
          <span style={{ marginRight: 4 }}>👩‍⚕️</span>
          Direkt Praxen anrufen und nach freien Plätzen & Wartelisten fragen.
        </li>
        <li>
          <span style={{ color: "#cc3366", marginRight: 4 }}>🏥</span>
          Sozialdienst der Klinik um Empfehlungen bitten.
        </li>
        <li>
          <span style={{ marginRight: 4 }}>🚨</span>
          Notfall-Angebote nutzen, wenn schnelle Hilfe nötig ist!
        </li>
      </ul>
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
