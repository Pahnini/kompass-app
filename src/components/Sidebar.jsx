import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ 
   items,
  current,
  setCurrent,
  isOpen,
  setIsOpen,
}) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClick = (key) => {
    setCurrent(key);
      if (!isDesktop) {
      setTimeout(() => setIsOpen(false), 300);
    }
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
