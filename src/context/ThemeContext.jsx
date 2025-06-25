import { createContext, useEffect, useState } from "react";
import { backgrounds } from "../data/backgrounds";
import { modernBlueGrey, themes } from "../data/themes";

// Create the context
const ThemeContext = createContext();

/**
 * Theme provider component
 * Manages theme and background state
 */
export function ThemeProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => modernBlueGrey);
  const [background, setBackground] = useState(() => backgrounds[0]);

  // Apply theme to document body
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.fontFamily = theme.font;
    document.body.style.color = theme.dark ? "#fff" : "#222";
    document.body.className = theme.dark ? "night" : "";
  }, [theme]);

  // Context value
  const value = {
    theme,
    setTheme,
    background,
    setBackground,
    availableThemes: themes,
    availableBackgrounds: backgrounds,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeContext;
