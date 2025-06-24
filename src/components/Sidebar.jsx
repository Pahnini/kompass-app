import { useEffect, useState } from "react";

export default function Sidebar({ items, current, setCurrent, isOpen, setIsOpen, favorites = [] }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter items to show only favorites, but always show 'home' and 'quickedit'
  const filteredItems = items.filter(item => 
    favorites.includes(item.key) || item.key === 'home' || item.key === 'quickedit'
  );

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
        {filteredItems.map((item) => (
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
