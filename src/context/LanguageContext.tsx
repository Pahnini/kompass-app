import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { get, set } from '../services/storageService';
import { availableLanguages, translations } from '../translations';

interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: string[];
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const saved = get<string>('kompass_language');
    return saved && availableLanguages.includes(saved) ? saved : 'de';
  });

  useEffect(() => {
    set('kompass_language', currentLanguage);
  }, [currentLanguage]);

  const setLanguage = useCallback((lang: string) => {
    if (availableLanguages.includes(lang)) {
      setCurrentLanguage(lang);
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const keys = key.split('.');
      let value: any = translations[currentLanguage];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }
      return typeof value === 'string' ? value : fallback || key;
    },
    [currentLanguage]
  );

  const value = useMemo(
    () => ({
      currentLanguage,
      availableLanguages,
      setLanguage,
      t,
    }),
    [currentLanguage, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
