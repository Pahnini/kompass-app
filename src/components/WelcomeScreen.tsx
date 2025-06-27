import React from "react";
import compassImg from "../assets/kompass-welcome.png";
import "./WelcomeScreen.css";

interface WelcomeScreenProps {
  onContinue: () => void;
}

export default function WelcomeScreen({
  onContinue,
}: WelcomeScreenProps): React.ReactElement {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-header">
          <img
            src={compassImg}
            alt="Kompass Illustration"
            className="welcome-image"
          />
          {/* <h1 className="welcome-title">Willkommen bei KompassApp</h1>
          <p className="welcome-subtitle">
            Deine App für den Alltag nach der Klinik
          </p> */}
        </div>

        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Skills & Achtsamkeit</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <span className="feature-text">Tagebuch & Ziele</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">Chatbot Unterstützung</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚨</span>
            <span className="feature-text">Notfall Hilfe</span>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="continue-btn" onClick={onContinue}>
            <span>Los geht's</span>
            <span className="btn-arrow">→</span>
          </button>
          <p className="welcome-note">
            Immer für dich da – Skills, Pläne & Hilfe bei Krisen
          </p>
        </div>
      </div>
    </div>
  );
}
