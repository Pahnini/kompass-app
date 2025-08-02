# Phase 2 – Qualitäts- & Strukturaufbau: Top‑Tier AI Coding Prompts

Für jeden der fünf Schritte in Phase 2 findest du hier jeweils zwei hochwertige Prompts – einen für GitHub Copilot und einen für Claude Code. Beide Prompts sind auf die Bedürfnisse von Senior Engineers und Tech Leads zugeschnitten.

---

## 1. Zentrale Fehlerbehandlung

**GitHub Copilot Prompt:**

```
// Als Senior Frontend Engineer und Error‑Handling‑Architekt,
// erstelle eine wiederverwendbare React ErrorBoundary-Komponente mit folgenden Merkmalen:
// - Globale und lokale ErrorBoundary-Implementierung
// - Logging-Service-Integration für error, warn, info, debug
// - Fallback-UI mit freundlichem Design, Accessibility (WCAG, ARIA), Focus-Management
// - Typisierung in TypeScript ohne any
// Schreibe sauberen, modularen Code mit klaren JSDoc-Kommentaren.
```

**Claude Code Prompt:**

```
Als Software Engineering Lead, implementiere in TypeScript eine zentrale ErrorBoundary-Architektur für eine React-App:
1. Eine globale ErrorBoundary, die alle Unterkomponenten umschließt
2. Lokale ErrorBoundaries für kritische Features (Datei-Upload, Chat)
3. Einen Logging-Service, der im Dev-Modus in der Konsole und im Prod-Modus später extern speichert
4. Eine barrierefreie Fallback-UI mit ARIA-Labels und Keyboard-Navigation
Bitte schreibe klar strukturierte Module und dokumentiere alle öffentlichen Schnittstellen.
```

---

## 2. Importpfade & Alias-System

**GitHub Copilot Prompt:**

```
// Als Senior Frontend‑Architekt,
// konfiguriere TypeScript und Vite für Alias-Importe:
// - Definiere Aliases: @/features, @/components, @/utils, @/services, etc.
// - Passe tsconfig.json und vite.config.ts an
// - Erweitere ESLint- und Vitest-Konfiguration, sodass Aliases in Tests funktionieren
// Schreibe präzise Code‑Beispiele und erkläre die Vorteile für neue Teammitglieder.
```

**Claude Code Prompt:**

```
Als Tech Lead, erstelle eine umfassende Alias-Konfiguration:
1. tsconfig.json mit mappting für @/features, @/hooks, @/assets
2. Vite-Konfiguration (vite.config.ts) mit Alias-Setup
3. Anpassung von ESLint und Vitest, damit Aliases in Lint- und Testläufen aufgelöst werden
4. Eine kurze Anleitung im README.md für Entwickler-Onboarding
Nutze TypeScript und dokumentiere alle Schritte ausführlich.
```

---

## 3. Testing

**GitHub Copilot Prompt:**

```
// Als Senior QA Engineer,
// implementiere ein Testing-Setup mit Vitest, React Testing Library und MSW:
// - Smoke-Tests für Startseite und Mood-Kompass
// - Unit-Tests für Hooks und Services
// - Komponententests mit user-event Interaktionen
// - MSW Mock-Server für API-Calls
// - Konfiguriere Coverage > 95% und GitHub Actions Pipeline
```

**Claude Code Prompt:**

```
Als Engineering Manager, richte ein Testing-Framework ein:
1. Vitest-Konfiguration für Snapshot- und DOM-Tests
2. Beispiele: Unit-Test eines Utility-Functions, Komponententest einer UI-Component
3. MSW-Setup für API-Mocking
4. GitHub Actions Workflow mit Test- und Coverage-Report
Dokumentiere Best Practices und Coverage-Ziele (95%+).
```

---

## 4. CI/CD

**GitHub Copilot Prompt:**

```
// Als Senior DevOps Engineer,
// erstelle eine GitHub Actions Konfiguration für CI/CD:
// - Build & Lint Pipeline: Vite-Build und ESLint bei jedem Push/PR
// - Test-Pipeline: Vitest-Tests mit Coverage-Check
// - Branch-Protection-Regeln (grüne Pipelines voraussetzen)
// - Vercel Preview-Deployments per Branch
// Kommentiere jede Action und erkläre, wie Secrets sicher verwaltet werden.
```

**Claude Code Prompt:**

```
Als Head of Engineering, definiere in GitHub Actions:
1. Workflow für Build, Lint und Test
2. Branch-Protection Settings (nur Merge bei grünem Status)
3. Integration mit Vercel für PR-Preview-Deployments
4. Versioniertes Deployment-Schema in README dokumentieren
Stelle sicher, dass Secrets (z.B. Vercel Token) sicher in GitHub hinterlegt sind.
```

---

## 5. Standards & Guidelines

**GitHub Copilot Prompt:**

```
// Als Chief Architect,
// formuliere Coding-Standards und Guidelines:
// - Security & Privacy (GDPR, .env, Input-Sanitizing, CSP)
// - ESLint/Prettier Style Guide (kein any, PascalCase, camelCase)
// - Dokumentation (JSDoc, Changelogs, Onboarding)
// - Accessibility (WCAG, ARIA, Tastatur-Navigation)
// - Performance (Lazy Loading, Asset-Optimierung, Memoization)
// - Team-Workflow (Branch-Naming, Commit-Format, PR-Review)
// - Tests & CI/CD Checkliste (Coverage, Accessibility-Audit)
// Schreibe klare, zielgruppenorientierte Texte für das Teamhandbuch.
```

**Claude Code Prompt:**

```
Als VP of Engineering, erstelle ein umfassendes Standards-Dokument in Markdown:
1. Security & Privacy: GDPR, .env-Handling, CORS, CSP
2. Coding Style: TypeScript ohne any, ESLint/Prettier-Setup
3. Dokumentation: README.md, JSDoc, Onboarding-Guides
4. Accessibility-Audit: WCAG, ARIA-Checks mit axe
5. Performance-Maßnahmen: Code-Splitting, Bildoptimierung
6. Team-Workflow: Branch-Convention, Commit-Messages, PR-Templates
7. Testing & CI/CD Checklist vor jedem Release
Füge Beispiele und genaue Konfigurations-Snippets hinzu.
```
