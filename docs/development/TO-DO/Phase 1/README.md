# 🔴 Phase 1 – Kritische Fehlerbehebung

**Ziel:** Sauberer, funktionierender Code ohne Blocker

## ✅ Fortschritt

- [x] **1. ESLint-Probleme lösen**
  - [x] `.eslintignore` einrichten ➜ Modernisiert zu `eslint.config.ts`
  - [x] TypeScript-spezifische Regeln aktivieren
  - [x] ESLint Dependencies installieren ➜ Bereits vorhanden
  - [x] React Import Fehler behoben (2 kritische Blocker)

- [ ] **2. TypeScript-Fehler beheben**
  - [ ] Typen präzisieren (`Skill`, `UserData`, etc.)
  - [ ] Ungenutzte Importe/Variablen entfernen
  - [ ] Type-Safety verbessern

- [ ] **3. Debug-Code entfernen**
  - [ ] `console.log` Statements entfernen
  - [ ] `debugFlags` entfernen
  - [ ] Unnötige Kommentare löschen
  - [ ] i18n Debug deaktivieren

- [ ] **4. localStorage-Zugriffe vereinheitlichen**
  - [ ] Alle direkten localStorage Calls finden
  - [ ] Über `storageService` abstrahieren
  - [ ] StorageService erweitern

- [ ] **5. .env sauber dokumentieren & konfigurieren**
  - [ ] `.env.example` erstellen/aktualisieren
  - [ ] Environment Types definieren
  - [ ] Pfade absichern
  - [ ] Validierung hinzufügen

## 📋 Erfolgskriterien

- ✅ `npm run lint` läuft ohne Fehler
- ✅ `npx tsc --noEmit` zeigt keine TypeScript Errors
- ✅ Keine `console.log` Statements in `src/`
- ✅ Alle localStorage Zugriffe über `storageService`
- ✅ `.env.example` vollständig dokumentiert

---

**Startdatum:** $(date)
**Status:** 🟡 In Bearbeitung
