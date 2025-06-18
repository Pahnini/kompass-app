import React from "react";
import {
  Home,
  Compass,
  Sparkles,
  Paintbrush,
  PhoneCall,
  Info,
  MessageCircle,
  Settings,
} from "lucide-react";

const iconMap = {
  home: <Home size={18} />,
  deinweg: <Compass size={18} />,
  skills: <Sparkles size={18} />,
  designs: <Paintbrush size={18} />,
  notfall: <PhoneCall size={18} />,
  guide: <Info size={18} />,
  chat: <MessageCircle size={18} />,
  quickedit: <Settings size={18} />,
};

export default function Sidebar({
  items,
  current,
  setCurrent,
  isOpen,
  setIsOpen,
}) {
  return (
    <nav aria-label="Hauptmenü" className={`sidebar${isOpen ? " open" : ""}`}>
      {!isOpen && (
        <button
          className="sidebar-toggle-mobile"
          onClick={() => setIsOpen(true)}
          aria-label="Menü öffnen"
        >
          ☰
        </button>
      )}
      {isOpen && (
        <button
          className="sidebar-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Menü schließen"
        >
          ✖
        </button>
      )}
      <div className="sidebar-content">
        {items.map((item) => (
          <button
            key={item.key}
            className={current === item.key ? "active" : ""}
            onClick={() => {
              setCurrent(item.key);
              setIsOpen(false);
            }}
            aria-label={item.label}
          >
            <span className="icon-gradient">
              {iconMap[item.key] || item.icon}
            </span>
            <span className="txt">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
