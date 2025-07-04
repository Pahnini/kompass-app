import { Compass } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import * as storageService from "../services/storageService";
import type { SidebarItem } from "../types/index";
import SortableQuickList from "./SortableQuickList";
import "./HomeScreen.css";

interface HomeScreenProps {
  username: string;
  setUsername: (username: string) => void;
  quickItems: string[];
  allItems: SidebarItem[];
  setFavorites: (items: string[]) => void;
}

export default function HomeScreen({
  username,
  setUsername,
  quickItems,
  allItems,
  setFavorites,
}: HomeScreenProps): React.ReactElement {
  const navigate = useNavigate();
  const { addPoints, level, levelProgress } = useUserData();
  const [animatingKey, setAnimatingKey] = useState<string | null>(null);

  const getPath = (key: string): string => (key === "home" ? "/" : `/${key}`);

  const handleQuickClick = (key: string) => {
    setAnimatingKey(key);
    addPoints(1);
    setTimeout(() => setAnimatingKey(null), 300);
    navigate(getPath(key));
  };

  return (
    <div className="card">
      {/* Begrüßung */}
      <div className="welcome-section">
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          <Compass size={64} color="#5dade2" />
        </div>
        <h1>Willkommen beim Kompass{username ? `, ${username}` : ""}!</h1>
        <p>Deine App für den Alltag nach der Klinik.</p>
        <p>Skills, Pläne, Chatbot & Hilfe bei Krisen – immer für dich da.</p>

        {!username && (
          <div className="form-row" style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Wie soll ich dich nennen?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  setUsername(e.currentTarget.value.trim());
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>("input");
                if (input?.value.trim()) {
                  setUsername(input.value.trim());
                }
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>

      {/* Mood & Journal */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
   
      
      </div>

      {/* XP-Level */}
      <div style={{ marginTop: "16px" }}>
        <div style={{ fontSize: "14px", marginBottom: "4px" }}>
          Level {level} – {Math.round(levelProgress)}%
        </div>
        <div style={{ background: "#ddd", height: "10px", borderRadius: "5px" }}>
          <div
            style={{
              width: `${levelProgress}%`,
              height: "100%",
              background: "#0b9444",
              borderRadius: "5px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Schnellzugriffe */}
      <div className="section">
        <h3>Deine Schnellzugriffe</h3>
        <SortableQuickList
          items={allItems}
          quickItemKeys={quickItems}
          onOrderChange={setFavorites}
          onItemClick={handleQuickClick}
          animatingKey={animatingKey}
        />
      </div>
    </div>
  );
}
