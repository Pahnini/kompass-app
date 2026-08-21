import type { ReactNode } from 'react';
import React, { createContext, useEffect, useState } from 'react';
import { collectReadableText } from '../utils/readableText';

const STORAGE_KEY = 'melforia_accessibility_v1';

export interface AccessibilitySettings {
  speechControlsEnabled: boolean;
  speechRate: number;
  largeText: boolean;
  enhancedFocus: boolean;
  reducedMotion: boolean;
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (changes: Partial<AccessibilitySettings>) => void;
  speechSupported: boolean;
  isSpeaking: boolean;
  statusMessage: string;
  speak: (text: string) => void;
  speakPage: () => void;
  stopSpeaking: () => void;
}

const defaultSettings: AccessibilitySettings = {
  speechControlsEnabled: true,
  speechRate: 1,
  largeText: false,
  enhancedFocus: true,
  reducedMotion: false,
};

function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>;
    return {
      ...defaultSettings,
      ...parsed,
      speechRate:
        typeof parsed.speechRate === 'number' &&
        parsed.speechRate >= 0.7 &&
        parsed.speechRate <= 1.4
          ? parsed.speechRate
          : defaultSettings.speechRate,
    };
  } catch {
    return defaultSettings;
  }
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);
export { AccessibilityContext };

export function AccessibilityProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const speechSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window;

  const updateSettings = React.useCallback((changes: Partial<AccessibilitySettings>): void => {
    setSettings(current => ({ ...current, ...changes }));
  }, []);

  const stopSpeaking = React.useCallback((): void => {
    const wasActive =
      speechSupported && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
    if (speechSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (wasActive) setStatusMessage('Vorlesen beendet.');
  }, [speechSupported]);

  const speak = React.useCallback(
    (text: string): void => {
      const cleanText = text.replace(/\s+/g, ' ').trim();
      if (!speechSupported) {
        setStatusMessage('Die Sprachausgabe wird von diesem Browser nicht unterstützt.');
        return;
      }
      if (!cleanText) {
        setStatusMessage('Auf dieser Seite wurde kein vorlesbarer Text gefunden.');
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const language = document.documentElement.lang || navigator.language || 'de-DE';
      const voices = window.speechSynthesis.getVoices();
      utterance.lang = language;
      utterance.rate = settings.speechRate;
      utterance.voice =
        voices.find(voice => voice.lang.toLowerCase() === language.toLowerCase()) ??
        voices.find(voice =>
          voice.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase())
        ) ??
        null;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setStatusMessage('Die Seite wird vorgelesen.');
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setStatusMessage('Vorlesen beendet.');
      };
      utterance.onerror = event => {
        setIsSpeaking(false);
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setStatusMessage('Die Sprachausgabe konnte nicht gestartet werden.');
        }
      };
      window.speechSynthesis.speak(utterance);
    },
    [settings.speechRate, speechSupported]
  );

  const speakPage = React.useCallback((): void => {
    const mainContent = document.querySelector<HTMLElement>('[data-speech-content="true"]');
    speak(mainContent ? collectReadableText(mainContent) : '');
  }, [speak]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const root = document.documentElement;
    root.classList.toggle('melforia-large-text', settings.largeText);
    root.classList.toggle('melforia-enhanced-focus', settings.enhancedFocus);
    root.classList.toggle('melforia-reduced-motion', settings.reducedMotion);
  }, [settings]);

  useEffect(
    () => () => {
      if (speechSupported) window.speechSynthesis.cancel();
    },
    [speechSupported]
  );

  const value = React.useMemo<AccessibilityContextType>(
    () => ({
      settings,
      updateSettings,
      speechSupported,
      isSpeaking,
      statusMessage,
      speak,
      speakPage,
      stopSpeaking,
    }),
    [
      settings,
      updateSettings,
      speechSupported,
      isSpeaking,
      statusMessage,
      speak,
      speakPage,
      stopSpeaking,
    ]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
