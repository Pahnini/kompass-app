import React from "react";

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({
  onClose,
}: OnboardingModalProps): React.ReactElement {
  return (
    <div className="ds-modal">
      <div className="ds-box" style={{ maxWidth: 500, textAlign: "left" }}>
        <h2>Willkommen bei Kompass!</h2>
        <ul style={{ lineHeight: 1.6 }}>
          <li>
            <b>„Mein Kompass“:</b> Digitales Tagebuch, Ziele, Erfolge,
            Symptomtagebuch & Stimmungskalender.
          </li>
          <li>
            <b>Skills:</b> Viele Ideen, wie du dich beruhigen oder stärken
            kannst – du kannst eigene Word-Dateien hochladen.
          </li>
          <li>
            <b>Designs:</b> Passe Farben & Aussehen an, wie du willst.
          </li>
          <li>
            <b>Notfall:</b> Soforthilfe, Telefonnummern & Links – du bist nie
            allein.
          </li>
          <li>
            <b>Guide:</b> Tipps, wie du nach der Klinik eine:n
            Psychotherapeut:in findest.
          </li>
          <li>
            <b>Chatbot:</b> Hier kannst du anonym schreiben & ausprobieren (Demo
            – kein echter Mensch!)
          </li>
          <li>
            Über die Sidebar wechselst du Funktionen. Du kannst die wichtigsten
            als „Kachel“ direkt auf den Homescreen holen.
          </li>
        </ul>
        <button onClick={onClose}>Los geht’s!</button>
      </div>
    </div>
  );
}
