# Internationalization (i18n) Feature Plan for KompassApp

## 🎯 **Approach: Custom i18n Solution**

We'll build a **custom, lightweight internationalization system** rather than using heavy libraries like react-i18next. This gives us:

- **Full control** over the implementation
- **Minimal bundle size** (no external dependencies)
- **Perfect fit** for our app's architecture
- **Easy extensibility** for future languages

## 📦 **No External Packages Needed**

We'll build this entirely with:

- **React Context** for language state management
- **Custom hooks** for easy translation access
- **JSON files** for translation storage
- **localStorage** for persistence (using existing storageService)

## 🏗️ **Implementation Architecture**

### **1. Translation Files Structure**

```
src/
├── translations/
│   ├── de.json          # German (current default)
│   ├── en.json          # English
│   └── index.js         # Translation loader
```

### **2. Core i18n System**

```
src/
├── context/
│   └── LanguageContext.jsx    # Language state & switching logic
├── hooks/
│   └── useTranslation.js      # Custom hook for translations
└── utils/
    └── i18nUtils.js           # Translation utilities
```

### **3. Language Context Structure**

- **Current language state** (`currentLanguage: 'de' | 'en'`)
- **Available languages** (`availableLanguages: ['de', 'en']`)
- **Translation data** (`translations: { de: {...}, en: {...} }`)
- **Switch function** (`setLanguage(lang)`)
- **Translation function** (`t(key, fallback?)`)

## 🔧 **Implementation Strategy**

### **Phase 1: Core Infrastructure**

1. **Create LanguageContext** with language switching logic
2. **Build useTranslation hook** for easy component access
3. **Set up translation JSON files** with initial German/English content
4. **Add localStorage persistence** using existing storageService
5. **Create language toggle UI** (flag icons or dropdown)

### **Phase 2: Translation Keys System**

```javascript
// Translation key structure
{
  "navigation": {
    "home": "Startseite",
    "skills": "Skills & Achtsamkeit",
    "deinweg": "Mein Kompass"
  },
  "buttons": {
    "back": "Zurück",
    "save": "Speichern",
    "share": "Teilen"
  },
  "forms": {
    "placeholders": {
      "newGoal": "Neues Ziel...",
      "achievement": "Erfolg heute?"
    }
  }
}
```

### **Phase 3: Component Migration**

1. **Start with navigation** (sidebar, buttons)
2. **Update form labels** and placeholders
3. **Translate static text** in all components
4. **Handle dynamic content** (dates, numbers)

## 🎨 **User Interface Design**

### **Language Toggle Options:**

1. **Flag Icons** in sidebar header (🇩🇪 🇬🇧)
2. **Dropdown** in settings/designs page
3. **Toggle Switch** with language codes (DE/EN)

**Recommendation**: Flag icons in sidebar - visual, intuitive, space-efficient

## 📝 **Translation Key Naming Convention**

```javascript
// Hierarchical structure
'page.component.element.type';

// Examples:
'sidebar.navigation.home'; // "Startseite" / "Home"
'deinweg.goals.placeholder'; // "Neues Ziel..." / "New Goal..."
'skills.shareButton'; // "Teilen" / "Share"
'common.buttons.back'; // "Zurück" / "Back"
```

## 🔄 **Usage Pattern in Components**

```javascript
// Before (hardcoded German)
<h2>Mein Kompass</h2>
<button>Zurück</button>
<input placeholder="Neues Ziel..." />

// After (translatable)
const { t } = useTranslation();

<h2>{t('deinweg.title')}</h2>
<button>{t('common.buttons.back')}</button>
<input placeholder={t('deinweg.goals.placeholder')} />
```

## 🚀 **Implementation Benefits**

### **Developer Experience:**

- **Simple API**: `const { t } = useTranslation()`
- **Type safety**: Can add TypeScript later
- **Hot reloading**: JSON changes reflect immediately
- **Fallback system**: Shows key if translation missing

### **User Experience:**

- **Instant switching**: No page reload needed
- **Persistent choice**: Language saved in localStorage
- **Consistent**: All text updates simultaneously
- **Accessible**: Proper language attributes for screen readers

### **Maintainability:**

- **Centralized**: All translations in JSON files
- **Extensible**: Easy to add new languages
- **Organized**: Hierarchical key structure
- **Reviewable**: Translators can work with JSON files

## 📊 **Migration Strategy**

### **Step-by-Step Rollout:**

1. **Set up infrastructure** (Context, hooks, files)
2. **Add language toggle** to UI
3. **Migrate high-impact areas** (navigation, buttons)
4. **Component-by-component** translation
5. **Test thoroughly** with both languages
6. **Polish and optimize**

### **Priority Order:**

1. **Navigation & Sidebar** (most visible)
2. **Common buttons** (Back, Save, Share, etc.)
3. **Form labels & placeholders**
4. **Page titles & headings**
5. **Static content & descriptions**
6. **Error messages & toasts**

## 🌍 **Future Extensibility**

The system will be designed to easily add:

- **Spanish** (`es.json`)
- **French** (`fr.json`)
- **Italian** (`it.json`)
- **Any other language**

Just add the JSON file and update the `availableLanguages` array!

## 💾 **Storage Integration**

Using existing `storageService.js`:

```javascript
// Add to STORAGE_KEYS
LANGUAGE: 'kompass_language';

// Add functions
export const getLanguage = () => getItem(STORAGE_KEYS.LANGUAGE, 'de');
export const setLanguage = lang => setItem(STORAGE_KEYS.LANGUAGE, lang);
```

## 🎯 **Current Status**

- **Status**: Planning phase complete
- **Next Steps**: Ready for implementation
- **Estimated Effort**: Medium (2-3 development sessions)
- **Impact**: High (makes app accessible to international users)

---

This plan provides a robust, scalable internationalization system that fits perfectly with the app's architecture. The implementation can be done incrementally without breaking existing functionality.
