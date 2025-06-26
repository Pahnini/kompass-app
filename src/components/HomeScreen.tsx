import { Compass } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SidebarItem } from "../data/navigation";

interface HomeScreenProps {
  username: string;
  setUsername: (username: string) => void;
  quickItems: string[];
  allItems: SidebarItem[];
}

export default function HomeScreen({
  username,
  setUsername,
  quickItems,
  allItems,
}: HomeScreenProps): React.ReactElement {
  const navigate = useNavigate();

  // Filter allItems to only show selected favorites
  const filteredItems = allItems.filter(
    (item) => quickItems.includes(item.key) || item.key === "home"
  );

  // Convert item key to path
  const getPath = (key: string): string => (key === "home" ? "/" : `/${key}`);

  return (
    <div className="card">
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
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                const input = e.currentTarget;
                if (e.key === "Enter" && input.value.trim()) {
                  setUsername(input.value.trim());
                }
              }}
            />
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                const button = e.currentTarget;
                const input = button.previousElementSibling as HTMLInputElement;
                if (input.value.trim()) {
                  setUsername(input.value.trim());
                }
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>

      <div className="section">
        <button
          className="edit-quick-items"
          onClick={() => navigate("/quickedit")}
        >
          ⚙️ Schnellzugriff bearbeiten
        </button>
      </div>

      <div className="section">
        <h3>Alle Bereiche</h3>
        <div className="quick-items-grid">
          {filteredItems.map((item, i) => (
            <div
              key={i}
              className="quick-item"
              onClick={() => navigate(getPath(item.key))}
            >
              <div className="icon">{item.icon}</div>
              <div className="label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
