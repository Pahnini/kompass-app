# 🧹 Schritt 2: Ungenutzte Variablen bereinigen

**Datum:** $(date)
**Status:** 🟡 In Bearbeitung

## 📋 Strategie:

### 🎯 Prioritäten:

1. **Context-Dateien zuerst** (größte Anzahl von Fehlern)
2. **Pages danach** (mittlere Anzahl)
3. **Components zuletzt** (einzelne Fehler)

### 🔍 Analyse der 34 ungenutzten Variablen:

#### 🏗️ **Context-Dateien (16 Fehler):**

- `UserDataContext.tsx`: 9 ungenutzte vars
- `UIContext.tsx`: 5 ungenutzte vars
- `ThemeContext.tsx`: 2 ungenutzte vars

#### 📄 **Pages (12 Fehler):**

- `GoalsPage.tsx`: 5 ungenutzte vars
- `SkillsPage.tsx`: 3 ungenutzte vars
- `HomePage.tsx`: 2 ungenutzte vars
- `QuickEditPage.tsx`: 1 ungenutzte var
- `SkillsPage.tsx`: 1 ungenutzte var

#### 🧩 **Components (6 Fehler):**

- `MoodCompass.tsx`: 2 ungenutzte vars
- `QuickAccess.tsx`: 1 ungenutzte var
- `WordFilePreview.tsx`: 1 ungenutzte var
- `Sidebar.tsx`: 1 ungenutzte var
- `SortableQuickList.tsx`: 1 ungenutzte var
- `ThemeSelector.tsx`: 1 ungenutzte var

## 🛠️ Bearbeitungsplan:

### Phase A: Context-Dateien (PRIORITÄT)

1. `UserDataContext.tsx` - 9 Variablen
2. `UIContext.tsx` - 5 Variablen
3. `ThemeContext.tsx` - 2 Variablen

### Phase B: Pages

4. `GoalsPage.tsx` - 5 Variablen
5. `SkillsPage.tsx` - 3 Variablen
6. `HomePage.tsx` - 2 Variablen
7. `QuickEditPage.tsx` - 1 Variable

### Phase C: Components

8. Alle Components (jeweils 1-2 Variablen)

---

**Ziel:** Von 34 auf 0 ungenutzte Variablen
**Methode:** Entweder verwenden oder mit `_` prefix markieren
