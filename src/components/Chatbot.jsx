import BackButton from "./BackButton";

export default function Chatbot({ onBack }) {
  return (
    <div className="card info-card">
      <BackButton onClick={onBack} />
      <h2>Chatbot (Demo)</h2>
      <p>
        Hier könntest du in einer echten App anonym schreiben oder Skills/Tipps
        bekommen.
        <br />
        In dieser Demo ist der Chat nur eine Platzhalterfunktion.
      </p>
      <p>
        <i>(Für echte Krisen immer mit echten Menschen sprechen!)</i>
      </p>
    </div>
  );
}
