import { Compass } from "lucide-react";

export default function HomeScreen({ 
  username, 
  setUsername, 
  quickItems,
  setQuickEdit, 
  allItems, 
  setCurrent 
}) {
  // Filter allItems to only show selected favorites
  const filteredItems = allItems.filter(item => 
    quickItems.includes(item.key) || item.key === 'home'
  );
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setUsername(e.target.value.trim());
                }
              }}
            />
            <button 
              onClick={(e) => {
                const input = e.target.previousElementSibling;
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
          onClick={() => setQuickEdit(true)}
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
              onClick={() => setCurrent(item.key)}
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
