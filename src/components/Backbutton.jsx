import { ArrowLeft } from "lucide-react";
// src/components/BackButton.jsx
import React from "react";

export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="back-button">
      ⬅️ Zurück
    </button>
  );
}