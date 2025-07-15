import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { moodMockResponses } from "../data/moodMockResponses";

const moods = [
  { label: "🥳 Stolz", value: "proud", color: "#00bfa5", group: "positive" },
  { label: "🌞 Hoffnung", value: "hopeful", color: "#4caf50", group: "positive" },
  { label: "🧠 Fokus", value: "focus", color: "#2f4f4f", group: "neutral" },
  { label: "😴 Erschöpft", value: "tired", color: "#757575", group: "neutral" },
  { label: "😖 Überfordert", value: "overwhelmed", color: "#ff7043", group: "negative" },
  { label: "😡 Wütend", value: "angry", color: "#e53935", group: "negative" },
  { label: "😰 Ängstlich", value: "anxious", color: "#5c6bc0", group: "negative" },
  { label: "🥶 Leer", value: "empty", color: "#90a4ae", group: "negative" },
];


interface Props {
  selected: string | null;
  onSelectMood: (value: string) => void;
}

const MoodCompass: React.FC<Props> = ({ selected, onSelectMood }) => {
  const [response, setResponse] = useState("");

  const handleClick = (moodValue: string) => {
    onSelectMood(moodValue);
    setResponse(moodMockResponses[moodValue] || "Heute zählt jeder kleine Schritt.");
  };

  return (
    <div 
      style={{ 
        textAlign: "center", 
        color: "#fff", 
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Kompass-Icon zentriert */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        style={{
          margin: "0 auto 2rem auto",
          width: 72,
          height: 72,
          borderRadius: "50%",
          border: "3px solid #66b2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Compass size={32} stroke="#66b2ff" />
      </motion.div>

      {/* Mood-Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1.2rem",
          marginBottom: "2rem",
          maxWidth: "100%",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {moods.map((mood) => {
          const isActive = selected === mood.value;
          return (
            <motion.button
              key={mood.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(mood.value)}
              style={{
                padding: "1rem 1.2rem",
                fontSize: "1rem",
                borderRadius: "12px",
                border: `2px solid ${isActive ? mood.color : "rgba(255, 255, 255, 0.2)"}`,
                background: isActive ? mood.color : "rgba(255, 255, 255, 0.1)",
                color: isActive ? "#fff" : "#fff",
                cursor: "pointer",
                boxShadow: isActive ? `0 0 12px ${mood.color}` : "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "500",
              }}
            >
              {mood.label}
            </motion.button>
          );
        })}
      </div>

      {/* Skill-Tipp */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "#f0fdf4",
            color: "#2f4f4f",
            border: "1px solid #0b9444",
            padding: "1rem",
            borderRadius: "0.75rem",
            fontSize: "0.95rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: "100%",
            width: "100%",
            margin: "1.5rem 0 0 0",
            boxSizing: "border-box",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
            lineHeight: "1.5",
            textAlign: "left",
          }}
        >
          <strong>Skill-Tipp:</strong> {response}
        </motion.div>
      )}
    </div>
  );
};

export default MoodCompass;
