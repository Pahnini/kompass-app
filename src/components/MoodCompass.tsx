import React, { useState } from "react";
import { motion } from "framer-motion";
import { getMockResponse } from "../data/moodMockResponses";

const directions = [
  { label: "🧠 Fokus", value: "focus", angle: 0 },
  { label: "🌞 Hoffnung", value: "hopeful", angle: 90 },
  { label: "😖 Überfordert", value: "overwhelmed", angle: 180 },
  { label: "😴 Erschöpft", value: "tired", angle: 270 },
];

const MoodCompass: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [response, setResponse] = useState("");

  const handleSelect = (dir: typeof directions[0]) => {
    setSelected(dir.value);
    setRotation(dir.angle);
    const mock = getMockResponse(dir.value);
    setResponse(mock);
    localStorage.setItem("moodToday", dir.value);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      marginTop: "1rem",
    }}>
      <div style={{ position: "relative", width: 300, height: 300 }}>
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            width: "100%",
            height: "100%",
            border: "10px solid #2f4f4f",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #b7ffd0, #2f4f4f)",
            position: "relative",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          {directions.map((dir) => (
            <motion.button
              key={dir.value}
              whileTap={{ scale: 1.05 }}
              onClick={() => handleSelect(dir)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `rotate(${dir.angle}deg) translate(130px) rotate(-${dir.angle}deg)`,
                transformOrigin: "center",
                background: selected === dir.value ? "#2f4f4f" : "#ffffff",
                color: selected === dir.value ? "white" : "#2f4f4f",
                border: "2px solid #2f4f4f",
                borderRadius: "999px",
                padding: "0.4rem 0.9rem",
                whiteSpace: "nowrap",
                fontSize: "1rem",
                cursor: "pointer",
                zIndex: selected === dir.value ? 2 : 1,
              }}
            >
              {dir.label}
            </motion.button>
          ))}
        </motion.div>
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
            textAlign: "center",
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
