import React, { createContext, ReactNode, useEffect, useState, useCallback, useMemo, useContext } from 'react';
import type { BackgroundOptions } from '../data/backgrounds';
import { backgrounds } from '../data/backgrounds';
import type { Theme } from '../data/themes';
import { modernBlueGrey, themes } from '../data/themes';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  background: BackgroundOptions;
  setBackground: (bg: BackgroundOptions) => void;
  availableThemes: Theme[];
  availableBackgrounds: BackgroundOptions[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export { ThemeContext };

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}



export function ThemeProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('kompass_theme');
    const found = themes.find(t => t.name === saved);
    return found || modernBlueGrey;
  });

  const setTheme = useCallback((newTheme: Theme): void => {
    setThemeState(newTheme);
    localStorage.setItem('kompass_theme', newTheme.name);
  }, []);

  const [background, setBackgroundState] = useState<BackgroundOptions>(() => backgrounds[0]);
  const setBackground = useCallback((bg: BackgroundOptions): void => {
    setBackgroundState(bg);
  }, []);

  useEffect(() => {
    document.body.classList.remove('light', 'night');
    document.body.classList.add(theme.dark ? 'night' : 'light');
  }, [theme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      background,
      setBackground,
      availableThemes: themes,
      availableBackgrounds: backgrounds,
    }),
    [theme, background, setTheme, setBackground]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
