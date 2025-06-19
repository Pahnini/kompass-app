import React from "react";
import "./WelcomeScreen.css";
import compassImg from "../assets/kompass-welcome.png";

export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <img src={compassImg} alt="Kompass Illustration" />
        <button onClick={onContinue}>Los geht's</button>
      </div>
    </div>
  );
}