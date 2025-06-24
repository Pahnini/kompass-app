
export default function QuickAccess({ items, quickItems, setCurrentPage }) {
  return (
    <div className="quickaccess">
      {/* Dynamische Quick-Items */}
      {quickItems.map((key) => {
        const item = items.find((i) => i.key === key);
        if (!item) return null;
        return (
          <button
            key={key}
            className="quick-btn"
            onClick={() => setCurrentPage(item.key)}
            aria-label={item.label}
          >
            <span className="icon-gradient">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Feste zusätzliche Buttons */}
      <button className="quick-btn" onClick={() => setCurrentPage("notfall")}>
        <span className="icon-gradient">🚨</span>
        <span>Notfall</span>
      </button>
      <button className="quick-btn" onClick={() => setCurrentPage("guide")}>
        <span className="icon-gradient">ℹ️</span>
        <span>Therapeut:in finden</span>
      </button>
    </div>
  );
}
