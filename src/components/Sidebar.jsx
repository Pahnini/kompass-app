import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ items, isOpen, setIsOpen, favorites = [] }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter items to show only favorites, but always show 'home' and 'quickedit'
  const filteredItems = items.filter(
    (item) =>
      favorites.includes(item.key) ||
      item.key === "home" ||
      item.key === "quickedit"
  );

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleClick = () => {
    if (!isDesktop) setIsOpen(false);
  };

  // Convert item key to path
  const getPath = (key) => (key === "home" ? "/" : `/${key}`);

  return (
    <>
      {!isDesktop && (
        <button
          className="sidebar-toggle-mobile"
          onClick={toggleSidebar}
          aria-label="Menü öffnen"
        >
          ☰
        </button>
      )}

      <aside className={`sidebar ${isOpen || isDesktop ? "open" : ""}`}>
        {filteredItems.map((item) => (
          <Link
            key={item.key}
            to={getPath(item.key)}
            className={`sidebar-item ${
              location.pathname === getPath(item.key) ? "active" : ""
            }`}
            onClick={handleClick}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </aside>
    </>
  );
}
