import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { SidebarItem } from "../types";
import supabase from "../utils/supabase";

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  favorites?: string[];
}

export default function Sidebar({
  items,
  isOpen,
  setIsOpen,
  favorites = [],
}: SidebarProps): React.ReactElement {
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 700);
  const location = useLocation();

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    // Redirect will happen automatically due to auth state change in App.tsx
    if (!isDesktop) {
      setIsOpen(false);
    }
  };

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

  const toggleSidebar = (): void => setIsOpen(!isOpen);
  const handleClick = (): void => {
    if (!isDesktop) {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  // Convert item key to path
  const getPath = (key: string): string => (key === "home" ? "/" : `/${key}`);

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
        <div className="sidebar-content">
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
        </div>

        <button className="sidebar-item logout-button" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="label">Abmelden</span>
        </button>
      </aside>
    </>
  );
}
