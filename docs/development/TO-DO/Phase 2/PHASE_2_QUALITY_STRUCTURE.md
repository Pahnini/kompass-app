# Phase 2 – Qualitäts- & Strukturaufbau

**Ziel:** Robustere Architektur und Vorbereitung auf Teamarbeit

## Übersicht

---

## 5. Standards & Guidelines

### Security & Privacy

- Keine sensiblen Daten (Tokens, Passwörter) im Code oder in der Versionierung
- Nutzung von .env-Dateien für Secrets, niemals ins Repo commiten
- GDPR: Datenexport, Löschung, Consent und Privacy Policy vorbereiten
- Validierung und Sanitizing aller User-Inputs (auch bei lokalem Storage)
- Keine Debug-Logs oder Flags in Produktion
- CORS- und Content-Security-Policy korrekt konfigurieren (für spätere Backend-Erweiterung)

### Coding Style

- Einheitlicher Code-Style mit ESLint und Prettier (siehe STYLE_GUIDE.md)
- Strikte Typisierung mit TypeScript, keine Verwendung von any
- Namenskonventionen: PascalCase für Komponenten, camelCase für Hooks/Services, englische Namen
- Keine toten oder auskommentierten Codeblöcke im Main-Branch
- Kommentare nur, wenn sie echten Mehrwert bieten

### Dokumentation

- README.md und docs/ immer aktuell halten (Onboarding, Architektur, CI/CD, Testing)
- JSDoc-Kommentare für alle Komponenten, Services und Hooks
- Changelogs für größere Änderungen
- Entwickler-Onboarding-Doku und Security-Guide ergänzen

### Accessibility (a11y)

- Alle interaktiven Elemente sind per Tastatur bedienbar
- ARIA-Labels und Rollen korrekt vergeben
- Kontraste und Schriftgrößen beachten (WCAG)
- Regelmäßige a11y-Tests (z.B. mit axe, Lighthouse)

### Performance

- Lazy Loading für große Komponenten/Features
- Bilder und Assets optimieren (WebP, SVG, responsive)
- Keine unnötigen Re-Renders (React.memo, useMemo, useCallback)
- Monitoring und Performance-Checks in CI/CD

### Team-Workflow

- Branch-Naming: feature/..., bugfix/..., hotfix/..., docs/...
- Commit-Format: Type: Kurzbeschreibung (max. 50 Zeichen)
- Pull Requests mit klarer Beschreibung und Link zu Issue/Ticket
- Code-Reviews sind Pflicht, kein Merge ohne Review
- Kleine, thematische Commits

### Testing & CI/CD

- 100% Testabdeckung, Tests pro Feature
- Tests, Linting und Build sind Pflicht in jeder Pipeline
- Branch-Protection: Kein Merge ohne grüne Pipelines

### Phase-Checklist (vor jedem Release)

- Alle TypeScript- und ESLint-Fehler behoben
- Unit-Tests > 95% Coverage, E2E-Tests für Kern-Userflows
- Accessibility-Audit bestanden (WCAG, ARIA)
- Security-Review bestanden (keine sensiblen Daten, Input validiert)
- Performance-Benchmarks erfüllt
- Dokumentation und Changelog aktuell
- Code-Review abgeschlossen

## 1. Zentrale Fehlerbehandlung

### Error Boundaries

- Globale ErrorBoundary-Komponente umschließt die gesamte App und fängt nicht abgefangene Fehler ab
- Lokale ErrorBoundaries für kritische Features/Komponenten (z.B. Datei-Upload, Chat, WordFilePreview)
- Wiederverwendbare ErrorBoundary-Komponente mit Props für individuelle Fallback-UI

### Logging-Service

- Zentrales Logging-Utility (z.B. `src/utils/logger.ts`)
- Unterstützt Log-Level: `error`, `warn`, `info`, `debug`
- Logs im Dev-Modus in der Konsole, im Prod-Modus ggf. in LocalStorage oder später an einen Service
- Logging von Fehlern aus ErrorBoundaries

### Fallback-UI (Top-Tier)

- Modernes, freundliches Design: großes Icon/Emoji, klare Fehlermeldung, „Neu laden“-Button, ggf. Support-Link
- Optional: Fehlerdetails für Entwickler im Dev-Modus anzeigen
- Barrierefreiheit: Fokus-Management, klare Sprache, Tastaturbedienung
- Branding: Farben, Logo, Maskottchen (z.B. Nova) einbinden

### Best Practices

- Fehler frühzeitig abfangen und gezielt loggen
- User Experience im Fehlerfall nicht vernachlässigen (keine „White Screens“)
- Fehler-UI so gestalten, dass Nutzer:innen wissen, was zu tun ist

## 2. Importpfade & Alias-System

### Alias-Konzept

- Einheitliche Aliases für alle Kernbereiche:
  - `@/features` – Feature-Ordner (z.B. Onboarding, Chat, MoodKompass)
  - `@/components` – Generische, wiederverwendbare UI-Komponenten
  - `@/hooks` – Generische Hooks
  - `@/utils` – Hilfsfunktionen
  - `@/services` – API- und Backend-Services
  - `@/context` – React Contexts
  - `@/types` – Typdefinitionen
  - `@/config` – Konfigurationsdateien
  - `@/assets` – Statische Assets (Bilder, Icons, Sounds)
- Optional: `@/pages`, `@/translations`, `@/views` je nach Bedarf

### Technische Umsetzung

- Aliases in `tsconfig.json` und `vite.config.ts` definieren
- ESLint- und ggf. Jest/Vitest-Konfiguration anpassen, damit Aliases überall funktionieren
- Klare Namenskonventionen für Aliases (kurz, sprechend, konsistent)

### Vorteile

- Übersichtliche, kurze und konsistente Importpfade
- Weniger Fehler durch Tippfehler in langen Relativpfaden
- Einsteiger finden sich schneller zurecht, da die Struktur selbsterklärend ist

### Best Practices

- Feature-basierte Ordnerstruktur: Jeder Feature-Ordner enthält Komponenten, Hooks, Services etc. für das jeweilige Feature
- Generische Bausteine (UI, Hooks, Utils) außerhalb der Features in eigenen Ordnern
- Aliases regelmäßig pflegen und bei Strukturänderungen anpassen

## 3. Testing

### Test-Framework

- **Vitest**: Modern, schnell, sehr gute Integration mit Vite und React, unterstützt Snapshot- und DOM-Tests (**empfohlen und gesetzt**)
- **React Testing Library**: Für realistische Komponententests
- **msw (Mock Service Worker)**: Für API-Mocking im Test

### Testarten

- **Smoke-Tests**: Sicherstellen, dass die Startseite und der Mood-Kompass ohne Fehler rendern
- **Unit-Tests**: Für Hilfsfunktionen, Hooks, Services
- **Component-Tests**: Mit React Testing Library, Fokus auf User-Interaktion und Rendering
- **(Optional) E2E-Tests**: Mit Playwright oder Cypress für komplette User-Flows

### Teststruktur & Best Practices

- Tests im jeweiligen Feature-Ordner ablegen (`__tests__` oder `.test.ts(x)`)
- Klare, sprechende Testnamen und -beschreibungen
- Mocking von Services und APIs, um unabhängige Tests zu ermöglichen
- Tests als Teil der CI/CD-Pipeline ausführen

### Vorteile

- Früherkennung von Fehlern und Regressionen
- Bessere Dokumentation des gewünschten Verhaltens
- Erhöhte Codequalität und Vertrauen bei Refactorings

## 4. CI/CD

### GitHub Actions

- Build & Lint Pipeline: Automatischer Build und Linting bei jedem Push/PR
- Test Pipeline: Automatisches Ausführen aller Vitest-Tests bei jedem Push/PR
- Branch-Protection: PRs dürfen nur gemergt werden, wenn Build & Tests erfolgreich sind

### Vercel Preview Deployments

- Automatische Preview-Deployments für jeden Branch/PR
- Vercel-Integration mit GitHub für nahtlose Deployments
- Optional: Deployment-Status als Kommentar im PR

### Best Practices

- Schnelle, zuverlässige Pipelines (keine unnötigen Schritte)
- Secrets (z.B. Vercel Token) sicher in GitHub Actions hinterlegen
- Fehlerausgabe und Logs für schnelles Debugging
- Dokumentation der CI/CD-Prozesse im Projekt

### Vorteile

- Fehler werden früh erkannt (vor dem Merge)
- Jeder Branch ist jederzeit als Preview testbar
- Automatisierte Qualitätssicherung und weniger manuelle Arbeit

---

## Nächste Schritte

1. Konzept reviewen und freigeben
2. Schrittweise Umsetzung der einzelnen Punkte

---

_Letztes Update: 31.07.2025_
