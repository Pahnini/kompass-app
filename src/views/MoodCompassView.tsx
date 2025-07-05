import React from "react";
import MoodCompass from "../components/MoodCompass";

const MoodCompassView: React.FC = () => {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#2f4f4f",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>
        🧭 Dein Stimmungs-Kompass
      </h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1rem" }}>
        Wie fühlst du dich heute? Wähle eine Richtung.
      </p>
      <MoodCompass />
    </div>
  );
};

export default MoodCompassView;
