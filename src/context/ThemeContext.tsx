import React, { createContext, ReactNode, useEffect, useState } from "react";
import { BackgroundOptions, backgrounds } from "../data/backgrounds";
import { modernBlueGrey, Theme, themes } from "../data/themes";

// Define the context type
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  background: BackgroundOptions;
  setBackground: (background: BackgroundOptions) => void;
  availableThemes: Theme[];
  availableBackgrounds: BackgroundOptions[];
}

// Create the context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider component
 * Manages theme and background state
 */
export function ThemeProvider({
  children,
}: ThemeProviderProps): React.ReactElement {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => modernBlueGrey);
  const [background, setBackground] = useState<BackgroundOptions>(
    () => backgrounds[0]
  );

  // Apply theme to document body
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.fontFamily = theme.font;
    document.body.style.color = theme.dark ? "#fff" : "#222";
    document.body.className = theme.dark ? "night" : "";
  }, [theme]);

  // Context value
  const value: ThemeContextType = {
    theme,
    setTheme,
    background,
    setBackground,
    availableThemes: themes,
    availableBackgrounds: backgrounds,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export default ThemeContext;
