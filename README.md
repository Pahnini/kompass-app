# 🧭 Kompass-App

**Dein digitaler Begleiter nach der Klinik.**  
Die Kompass-App unterstützt junge Menschen nach einem psychiatrischen Klinikaufenthalt mit Skills, Selbsthilfetools, einem Symptom-Tagebuch, Kriseninfos und mehr.

## 🌟 Funktionen

- 🧠 Selbsthilfe-Pläne & Skills
- 📘 Symptom-Tagebuch mit Ausprägungs-Skala
- 📍 Mein Kompass: persönliche Ziele & Tagesstruktur
- 🆘 Notfallhilfe & direkte Kontakte
- 🤖 Chatbot für Hilfe & Orientierung
- 💬 (Geplant): Guide zur Therapeut\*innensuche
- 📱 Mobile-optimiertes Design

## 🛠 Tech-Stack

- **Frontend:** React (Vite)
- **Styling:** Custom CSS (GlobalStyle.js)
- **Icons:** [lucide-react](https://lucide.dev/)
- **Hosting:** Vercel
- **State/Storage:** useState, useEffect, localStorage

---

## 🚀 Installation

### 1. Klonen

```bash
git clone https://github.com/DEIN-NUTZERNAME/kompass-app.git
cd kompass-app
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Lokalen Dev-Server starten

```bash
npm run dev
```

Die App läuft dann unter `http://localhost:5173`.

---

## 📚 Documentation

Comprehensive documentation and development resources:

- **[📖 Full Documentation](docs_and_scripts/)** - Complete documentation index
- **[🤝 Contributing Guide](docs_and_scripts/contributing/)** - How to contribute
- **[🔧 Development Docs](docs_and_scripts/development/)** - Roadmaps and guides
- **[✨ Feature Specs](docs_and_scripts/features/)** - Feature documentation

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

### 🤖 Automated Sync Scripts

For contributors: We provide automated scripts to streamline the contribution workflow:

```bash
cd scripts
./sync-to-main.sh    # Automated sync to main repository with PR creation
./quick-sync.sh      # Quick sync for experienced contributors
./setup-repo.sh      # One-time repository setup
```

**Features:**

- ✅ Automatic rebase onto upstream/main
- ✅ Safe force-push with `--force-with-lease`
- ✅ Automated Pull Request creation (with GitHub CLI)
- ✅ Comprehensive error handling

📖 **[Full Documentation](scripts/SYNC_SCRIPTS_README.md)**

---

## 📂 Projektstruktur

```
src/
├── components/     # Reusable Components (Sidebar, BackButton, etc.)
├── screens/        # Views: WelcomeScreen, HomeScreen, Notfall, etc.
├── styles/         # GlobalStyle.js + CSS
├── App.js          # Hauptlogik & Routing
├── main.jsx        # Entry Point
```

---

## 📜 Lizenz

MIT License – siehe [LICENSE](./LICENSE)

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
