import BackButton from "./BackButton";
export default function Notfall({ hilfeWebsites }) {
  return (
    <div className="card notfall-card">
        <button className="back-btn-icon" onClick={onBack} aria-label="Zurück">
  ⬅️ Zurück
</button>
      <h2>Notfall / Hilfe</h2>
      <div className="contact-list">
        <a href="tel:116111">📞 116111 Jugendtelefon</a>
        <a href="tel:08001110111">📞 0800 111 0 111 Telefonseelsorge</a>
        <a href="tel:112">🚑 112 Notruf</a>
      </div>
      <div
        style={{
          margin: "18px 0 10px 0",
          fontWeight: "bold",
          color: "#0b9444",
        }}
      >
        Websites & Hilfe:
      </div>
      <ul>
        {hilfeWebsites.map((h) => (
          <li key={h.url}>
            <a href={h.url} target="_blank" rel="noopener noreferrer">
              {h.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="invite-friends">
        <p>
          Freunde einladen:{" "}
          <input
            readOnly
            value={window.location.href}
            onFocus={(e) => e.target.select()}
            style={{ width: "80%" }}
          />{" "}
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            📋
          </button>
        </p>
      </div>
    </div>
  );
}
