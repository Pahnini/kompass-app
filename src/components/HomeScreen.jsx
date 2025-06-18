import React from "react";
import { Compass } from "lucide-react";

export default function HomeScreen({ setCurrent }) {
  return (
    <div className="home-screen">
      <div className="hero-bg" />
      <div className="homecard">
        <div className="icon-circle">
          <Compass size={64} />
        </div>
        <h1>Willkommen beim Kompass</h1>
        <p>Deine App für den Alltag nach der Klinik.</p>
        <p>Skills, Pläne, Chatbot & Hilfe bei Krisen – immer für dich da.</p>
        <div className="quickaccess">
          <button className="quick-btn" onClick={() => setCurrent("skills")}>
            Skills
          </button>
          <button className="quick-btn" onClick={() => setCurrent("meinweg")}>
            Mein Kompass
          </button>
          <button className="quick-btn" onClick={() => setCurrent("notfall")}>
            Notfall
          </button>
          <button className="quick-btn" onClick={() => setCurrent("guide")}>
            Therapeut:in finden
          </button>
        </div>
      </div>
    </div>
  );
}
