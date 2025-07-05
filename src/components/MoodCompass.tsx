import React, { useState } from "react";
import { motion } from "framer-motion";
import { getMockResponse } from "../data/moodMockResponses";

const directions = [
  { label: "🧠 Fokus", value: "focus" },
  { label: "🌞 Hoffnung", value: "hopeful" },
  { label: "😖 Überfordert", value: "overwhelmed" },
  { label: "😴 Erschöpft", value: "tired" },
];

const MoodCompass: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  const radius = 120; // Abstand vom Mittelpunkt

  const handleSelect = (value: string) => {
    setSelected(value);
    const mock = getMockResponse(value);
    setResponse(mock);
    localStorage.setItem("moodToday", value);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 300,
          height: 300,
          position: "relative",
          borderRadius: "50%",
          border: "8px solid #2f4f4f",
          background: "linear-gradient(135deg, #b7ffd0, #2f4f4f)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {directions.map((dir, i) => {
          const angle = (i / directions.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <motion.button
              key={dir.value}
              whileTap={{ scale: 1.05 }}
              onClick={() => handleSelect(dir.value)}
              style={{
                position: "absolute",
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                background: selected === dir.value ? "#2f4f4f" : "#ffffff",
                color: selected === dir.value ? "white" : "#2f4f4f",
                border: "2px solid #2f4f4f",
                borderRadius: "999px",
                padding: "0.4rem 0.8rem",
                whiteSpace: "nowrap",
                fontSize: "1rem",
                cursor: "pointer",
                zIndex: selected === dir.value ? 10 : 1,
              }}
            >
              {dir.label}
            </motion.button>
          );
        })}
      </div>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "#f0fdf4",
            border: "2px solid #2f4f4f",
            padding: "1rem 1.5rem",
            borderRadius: "1rem",
            maxWidth: "90%",
            marginTop: "2rem",
            color: "#2f4f4f",
            fontSize: "1.1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <strong>Skill-Tipp:</strong> {response}
        </motion.div>
      )}
    </div>
  );
};

export default MoodCompass;
