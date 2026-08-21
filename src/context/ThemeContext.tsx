import type { ReactNode } from 'react';
import React, { createContext, useEffect, useRef, useState } from 'react';
import type { BackgroundOptions } from '../data/backgrounds';
import { backgrounds, createCustomBackground, CUSTOM_BACKGROUND_ID } from '../data/backgrounds';
import type { Theme } from '../data/themes';
import { modernBlueGrey, themes } from '../data/themes';
import {
  deleteCustomBackground,
  loadCustomBackground,
  saveCustomBackground,
} from '../services/customBackgroundService';

const THEME_STORAGE_KEY = 'kompass_theme';
const BACKGROUND_STORAGE_KEY = 'melforia_background';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  background: BackgroundOptions;
  setBackground: (bg: BackgroundOptions) => void;
  customBackground: BackgroundOptions | null;
  setCustomBackground: (blob: Blob, fileName: string) => Promise<void>;
  removeCustomBackground: () => Promise<void>;
  availableThemes: Theme[];
  availableBackgrounds: BackgroundOptions[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export { ThemeContext };

export function ThemeProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const found = themes.find(t => t.name === saved);
    return found || modernBlueGrey;
  });

  // Use useCallback to ensure stable reference for setTheme
  const setTheme = React.useCallback((newTheme: Theme): void => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme.name);
  }, []);

  const [background, setBackgroundState] = useState<BackgroundOptions>(() => {
    const saved = localStorage.getItem(BACKGROUND_STORAGE_KEY);
    return backgrounds.find(item => item.id === saved) ?? backgrounds[0];
  });
  const [customBackground, setCustomBackgroundState] = useState<BackgroundOptions | null>(null);
  const customObjectUrl = useRef<string | null>(null);

  // Use useCallback to ensure stable reference for setBackground
  const setBackground = React.useCallback((bg: BackgroundOptions): void => {
    setBackgroundState(bg);
    localStorage.setItem(BACKGROUND_STORAGE_KEY, bg.id);
  }, []);

  const releaseCustomObjectUrl = React.useCallback(() => {
    if (customObjectUrl.current) {
      URL.revokeObjectURL(customObjectUrl.current);
      customObjectUrl.current = null;
    }
  }, []);

  const setCustomBackground = React.useCallback(
    async (blob: Blob, fileName: string): Promise<void> => {
      await saveCustomBackground(blob, fileName);
      releaseCustomObjectUrl();
      const objectUrl = URL.createObjectURL(blob);
      customObjectUrl.current = objectUrl;
      const nextBackground = createCustomBackground(objectUrl, fileName);
      setCustomBackgroundState(nextBackground);
      setBackgroundState(nextBackground);
      localStorage.setItem(BACKGROUND_STORAGE_KEY, CUSTOM_BACKGROUND_ID);
    },
    [releaseCustomObjectUrl]
  );

  const removeCustomBackground = React.useCallback(async (): Promise<void> => {
    await deleteCustomBackground();
    releaseCustomObjectUrl();
    setCustomBackgroundState(null);
    setBackgroundState(current => {
      if (current.id !== CUSTOM_BACKGROUND_ID) return current;
      localStorage.setItem(BACKGROUND_STORAGE_KEY, backgrounds[0].id);
      return backgrounds[0];
    });
  }, [releaseCustomObjectUrl]);

  useEffect(() => {
    let cancelled = false;

    void loadCustomBackground()
      .then(stored => {
        if (!stored || cancelled) return;
        releaseCustomObjectUrl();
        const objectUrl = URL.createObjectURL(stored.blob);
        customObjectUrl.current = objectUrl;
        const loadedBackground = createCustomBackground(objectUrl, stored.fileName);
        setCustomBackgroundState(loadedBackground);
        if (localStorage.getItem(BACKGROUND_STORAGE_KEY) === CUSTOM_BACKGROUND_ID) {
          setBackgroundState(loadedBackground);
        }
      })
      .catch(() => {
        if (localStorage.getItem(BACKGROUND_STORAGE_KEY) === CUSTOM_BACKGROUND_ID) {
          localStorage.setItem(BACKGROUND_STORAGE_KEY, backgrounds[0].id);
          setBackgroundState(backgrounds[0]);
        }
      });

    return () => {
      cancelled = true;
      releaseCustomObjectUrl();
    };
  }, [releaseCustomObjectUrl]);

  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.fontFamily = theme.font;
    document.body.style.color = theme.dark ? '#fff' : '#222';
    document.body.classList.toggle('night', theme.dark);
  }, [theme]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      background,
      setBackground,
      customBackground,
      setCustomBackground,
      removeCustomBackground,
      availableThemes: themes,
      availableBackgrounds: backgrounds,
    }),
    [
      theme,
      background,
      customBackground,
      setTheme,
      setBackground,
      setCustomBackground,
      removeCustomBackground,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
