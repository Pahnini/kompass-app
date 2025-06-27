import React from "react";
import type { Theme } from "../data/themes";
import { themes } from "../data/themes";

interface ThemeSelectorProps {
  currentTheme: string;
  onChange: (theme: Theme) => void;
}

export default function ThemeSelector({
  currentTheme,
  onChange,
}: ThemeSelectorProps): React.ReactElement {
  return (
    <>
      <div className="theme-selector">
        <label htmlFor="theme-select">🎨 Theme wählen:</label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={(e) => {
            const selected = themes.find((t) => t.name === e.target.value);
            if (selected) onChange(selected);
          }}
        >
          {themes.map((theme) => (
            <option key={theme.name} value={theme.name}>
              {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="theme-options">
        {themes.map((t) => (
          <button
            key={t.name}
            className={`theme-button ${
              currentTheme === t.name ? "active" : ""
            }`}
            onClick={() => onChange(t)}
            style={{
              backgroundColor: t.bg,
              color: t.primary,
              fontFamily: t.font,
              border: `2px solid ${
                currentTheme === t.name ? t.accent : "transparent"
              }`,
              padding: "10px",
              margin: "6px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>
    </>
  );
}
