import React, { createContext, ReactNode, useEffect, useState } from 'react';
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

export function ThemeProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('kompass_theme');
    const found = themes.find(t => t.name === saved);
    return found || modernBlueGrey;
  });

  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme);
    localStorage.setItem('kompass_theme', newTheme.name);
  };

  const [background, setBackground] = useState<BackgroundOptions>(() => backgrounds[0]);

  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.fontFamily = theme.font;
    document.body.style.color = theme.dark ? '#fff' : '#222';
    document.body.className = theme.dark ? 'night' : '';
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        background,
        setBackground,
        availableThemes: themes,
        availableBackgrounds: backgrounds,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
