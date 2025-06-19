import React, { useEffect, useState } from "react";

export default function Sidebar({ items, current, setCurrent, isOpen, setIsOpen }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleClick = (key) => {
    setCurrent(key);
    if (!isDesktop) setIsOpen(false);
  };

  return (
    <>
      {!isDesktop && (
        <button className="sidebar-toggle-mobile" onClick={toggleSidebar} aria-label="Menü öffnen">
          ☰
        </button>
      )}

      <aside className={`sidebar ${isOpen || isDesktop ? "open" : ""}`}>
        {items.map((item) => (
          <button
            key={item.key}
            className={`sidebar-item ${current === item.key ? "active" : ""}`}
            onClick={() => handleClick(item.key)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </aside>
    </>
  );
}
