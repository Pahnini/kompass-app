import React from "react";

export default function QuickEdit({
  quickItems,
  setQuickItems,
  allItems,
  onBack,
}) {
  function toggleQuick(key) {
    setQuickItems(
      quickItems.includes(key)
        ? quickItems.filter((f) => f !== key)
        : [...quickItems, key]
    );
  }

  return (
    <div className="card" style={{ maxWidth: 500, margin: "0 auto" }}>
      <button className="back-btn" onClick={onBack}>
        ←
      </button>
      <h2>Funktionen für Home auswählen</h2>
      <ul>
        {allItems
          .filter((i) => i.key !== "home" && i.key !== "quickedit")
          .map((item) => (
            <li key={item.key}>
              <label>
                <input
                  type="checkbox"
                  checked={quickItems.includes(item.key)}
                  onChange={() => toggleQuick(item.key)}
                />
                {item.icon} {item.label}
              </label>
            </li>
          ))}
      </ul>
      <button onClick={onBack}>Zurück</button>
    </div>
  );
}
