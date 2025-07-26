# 🧭 Kompass-App

**Dein digitaler Begleiter nach der Klinik.**  
Die Kompass-App unterstützt junge Menschen nach einem psychiatrischen Klinikaufenthalt mit Skills, Selbsthilfetools, einem Symptom-Tagebuch, Kriseninfos und mehr.

## 🌟 Funktionen

- 🧠 **Selbsthilfe-Pläne & Skills** - Persönliche Skills-Sammlung und Bewältigungsstrategien
- 📘 **Symptom-Tagebuch** - MoodCompass für Stimmungstracking mit visueller Darstellung
- 📍 **Mein Kompass** - Persönliche Ziele & Tagesstruktur mit Fortschrittsanzeige
- 🎯 **Gamification** - Achievements-System mit Punkten, Levels und Belohnungen
- 🏫 **Schulunterstützung** - Planungstools und Dateiverwaltung für den Schulalltag
- 🆘 **Notfallhilfe** - PanicButton und direkte Kontakte für Krisen
- 🤖 **AI-Chatbot** - Intelligente Hilfe & Orientierung mit GPT-Integration
- 📱 **Mobile-First Design** - Responsive Design mit Touch-optimierter Bedienung
- 🌍 **Mehrsprachig** - Deutsch, Englisch und Türkisch verfügbar
- 🎨 **Individualisierung** - Anpassbare Themes und Hintergründe
- 📁 **Dateiverwaltung** - Upload und Vorschau von Word-Dokumenten

## 🛠 Tech-Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** TailwindCSS + Custom CSS (GlobalStyle)
- **State Management:** React Context (UserDataContext, ThemeContext, UIContext)
- **Routing:** React Router DOM v7
- **Icons:** [Lucide React](https://lucide.dev/)
- **Internationalization:** i18next mit Browser-Spracherkennung
- **Backend/Auth:** Supabase (Authentication & Database)
- **Storage:** localStorage via StorageService
- **Drag & Drop:** @dnd-kit
- **Animations:** Framer Motion
- **AI-Integration:** GPT-Service für Chatbot
- **Deployment:** Vercel
- **Development Tools:** ESLint, Prettier, Husky, lint-staged

---

## 🚀 Installation & Entwicklung

### 1. Repository klonen

```bash
git clone https://github.com/DEIN-NUTZERNAME/kompass-app.git
cd kompass-app
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft dann unter `http://localhost:5173`.

### 4. Weitere Entwicklungskommandos

```bash
# Projekt für Produktion bauen
npm run build

# Produktionsversion lokal testen
npm run preview

# Code linting und formatting
npm run lint          # ESLint ausführen
npm run lint:fix       # ESLint mit automatischen Fixes
npm run format         # Code mit Prettier formatieren
npm run format:check   # Formatierung prüfen
npm run type-check     # TypeScript Typen prüfen

# Pre-commit hooks einrichten (automatisch bei npm install)
npm run prepare
```

---

## 🤝 Mitmachen

Du willst helfen? Großartig! Jede Unterstützung ist willkommen – ob UX-Ideen, Bugfixes oder neue Features.

### Einstieg:

1. Repo forken & klonen
2. Schau ins [Project Board](https://github.com/pahnini/kompass-app/projects/1) für offene Tickets
3. Wähle ein `good first issue` oder sprich dich mit mir ab
4. Branch erstellen, PR öffnen, fertig 💪

### Labels:

- `good first issue`: ideal zum Reinkommen
- `bug`: Fehler beheben
- `enhancement`: Verbesserungen
- `UX`: Design & Benutzerfreundlichkeit
- `help wanted`: Ideen oder Unterstützung gesucht

---

## 📂 Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── ui/             # Basis UI-Komponenten (Progress, etc.)
│   ├── common/         # Gemeinsame Komponenten
│   ├── layout/         # Layout-spezifische Komponenten
│   └── SchoolSupport/  # Schulunterstützung-Komponenten
├── views/              # Seitenansichten (MoodCompassView, PanicScreen)
├── screens/            # Screen-Komponenten (AchievementsScreen, HomeScreen)
├── context/            # React Context Provider (UserData, Theme, UI)
├── hooks/              # Custom React Hooks (useUserData, useTheme)
├── services/           # Externe Services (storageService, gptService, supabase)
├── data/               # Statische Daten (achievements, skills, themes)
├── translations/       # i18n Übersetzungsdateien (de.json, en.json, tr.json)
├── utils/              # Hilfsfunktionen (shareUtils, toastUtils, wordParser)
├── types/              # TypeScript Typdefinitionen
├── config/             # Konfigurationsdateien (themePresets)
├── i18n/               # Internationalisierung Setup
├── App.tsx             # Hauptkomponente mit Routing
└── main.tsx            # Entry Point mit Context Providern
```

### Wichtige Architektur-Patterns

- **Context-basiertes State Management**: UserDataContext, ThemeContext, UIContext
- **Lazy Loading**: Performance-Optimierung für nicht-kritische Komponenten
- **Service Layer**: Abstraktion für externe APIs und localStorage
- **Hook-basierte Logik**: Wiederverwendbare Geschäftslogik in Custom Hooks
- **TypeScript**: Vollständige Typisierung für bessere Entwicklererfahrung

---

## 🚀 Features im Detail

### Gamification-System

- **Punktesystem**: Belohnungen für erreichte Ziele und Skills
- **Achievements**: Verschiedene Errungenschaften mit Icons und Fortschritt
- **Level-System**: Progression basiert auf gesammelten Punkten
- **Motivationsförderung**: Spielerische Elemente zur Steigerung der Nutzung

### Internationalisierung

- **Sprachen**: Deutsch (Standard), Englisch, Türkisch
- **Automatische Erkennung**: Browser-Sprache wird automatisch erkannt
- **Fallback**: Deutsch als Standardsprache bei nicht unterstützten Sprachen
- **Lokaler Speicher**: Spracheinstellung wird gespeichert

### Theme & Personalisierung

- **Anpassbare Themes**: Verschiedene Farbschemata
- **Hintergrundbilder**: Personalisierte Hintergründe
- **Responsive Design**: Optimiert für alle Bildschirmgrößen
- **Touch-Optimiert**: Mobile-First Design für optimale Bedienung

---

## 📜 Lizenz

**Proprietary License** – siehe [LICENSE](./LICENSE)

---

## 📣 Kontakt

Bei Fragen, Ideen oder Feedback:

> **florianpahn@aol.com**  
> Oder direkt via GitHub Issues.

---

---

---

##⚠️ Lizenzhinweis

Dieses Projekt ist **nicht Open Source**.

Der Code ist urheberrechtlich geschützt und darf **nicht ohne ausdrückliche Genehmigung** verwendet, kopiert, verändert oder veröffentlicht werden – auch nicht auszugsweise.

Bei Interesse an einer Nutzung oder Kooperation:

> **florianpahn@aol.com**
