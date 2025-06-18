import React from "react";

export default function DatenschutzModal({ onClose, dsHinweis }) {
  return (
    <div className="ds-modal">
      <div className="ds-box">
        <p>{dsHinweis}</p>
        <button onClick={onClose}>Alles klar 👍</button>
      </div>
    </div>
  );
}
