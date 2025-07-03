// src/services/storageService.ts

/**
 * Speichert einen beliebigen Wert im localStorage, typisiert als JSON.
 * @param key - Der Schlüssel für den Eintrag
 * @param value - Der zu speichernde Wert (string, object, array, etc.)
 */
export function set<T = unknown>(key: string, value: T): void {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  } catch (error) {
    console.error(`[storageService] Fehler beim Speichern von "${key}":`, error);
  }
}

/**
 * Lädt einen gespeicherten Wert aus localStorage.
 * @param key - Der Schlüssel des Werts
 * @returns Der gespeicherte Wert (typisiert) oder null
 */
export function get<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[storageService] Fehler beim Laden von "${key}":`, error);
    return null;
  }
}

/**
 * Entfernt einen Eintrag aus dem localStorage.
 * @param key - Der Schlüssel, der gelöscht werden soll
 */
export function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[storageService] Fehler beim Entfernen von "${key}":`, error);
  }
}
