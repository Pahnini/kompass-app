# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run type-check` - Run TypeScript type checking without emitting files

### Pre-commit Hooks

- Husky and lint-staged are configured to run on pre-commit
- Automatically runs Prettier and ESLint on staged files
- Uses `npm run prepare` to set up Husky hooks

## Architecture Overview

### Tech Stack

- **Frontend**: React 19 with TypeScript and Vite
- **Styling**: TailwindCSS + custom CSS with GlobalStyle component
- **Icons**: Lucide React
- **Internationalization**: i18next with browser language detection
- **Routing**: React Router DOM v7
- **State Management**: React Context (UserDataContext, ThemeContext, UIContext)
- **Storage**: localStorage via storageService
- **Backend**: Supabase (auth and data)
- **Drag & Drop**: @dnd-kit library
- **Animations**: Framer Motion

### Core Architecture Patterns

**Context-Driven State Management**: The app uses multiple React contexts for different concerns:

- `UserDataContext` - User data, goals, achievements, skills, points/gamification
- `ThemeContext` - Theme configuration and background settings
- `UIContext` - UI state and interactions

**Provider Hierarchy** (src/main.tsx): ErrorBoundary → UserDataProvider → BrowserRouter → UIProvider → ThemeProvider → App

**Lazy Loading**: Non-critical components are lazy-loaded for performance (Chatbot, DeinWeg, Designs, Guide, Notfall, QuickEdit, Skills)

**Service Layer**:

- `storageService.ts` - localStorage abstraction
- `gptService.ts` - AI chatbot integration
- `supabase.ts` - Backend API calls

### Key Directories

**Components Structure**:

- `/components` - Reusable UI components (modals, buttons, shared functionality)
- `/components/ui` - Base UI components (Progress, etc.)
- `/components/common` - Common shared components
- `/components/layout` - Layout-specific components
- `/views` - Page-level view components (MoodCompassView, PanicScreen, SchoolSupportView)
- `/screens` - Screen components (AchievementsScreen, HomeScreen)

**Data & Configuration**:

- `/data` - Static data files (achievements, skills, templates, navigation, themes)
- `/config` - Configuration files (themePresets.ts)
- `/translations` - i18n translation files (de.json, en.json, tr.json)

**Application Logic**:

- `/hooks` - Custom React hooks (useUserData, useTheme, useUI, usePageTitle, useQuest)
- `/context` - React context providers
- `/services` - External service integrations
- `/utils` - Utility functions (sharing, supabase, toast notifications, word parsing)

### Internationalization

- Default language: German (`de`)
- Fallback language: German
- Supported languages: German (de), English (en), Turkish (tr)
- Detection: localStorage → browser language
- Translation files in `/translations/` directory

### Key Features Architecture

**Gamification System**: Points, levels, achievements tracked in UserDataContext with persistent storage

**Skills & Goals System**: User can create/manage personal skills and goals with progress tracking

**Theme System**: Dynamic theming with preset themes and custom backgrounds

**Emergency Features**: PanicScreen and emergency contacts for mental health support

**School Support**: Dedicated views for academic planning and transition support

**Mood Tracking**: MoodCompassView for emotional state monitoring

## Development Guidelines

### File Naming & Structure

- React components use PascalCase (e.g., `HomeScreen.tsx`)
- Hooks use camelCase with "use" prefix (e.g., `useUserData.ts`)
- Services use camelCase with service suffix (e.g., `storageService.ts`)
- Data files use camelCase (e.g., `achievementList.tsx`)

### TypeScript Configuration

- Strict mode enabled with noUnusedLocals and noUnusedParameters
- Path alias configured: `src/*` maps to `["src/*"]`
- JSX mode: `react-jsx`
- Target: `ESNext` with bundler module resolution

### State Management Patterns

- Use contexts for app-wide state (user data, theme, UI)
- Use useState for component-local state
- Persistent data goes through storageService to localStorage
- All user data operations should go through UserDataContext

### Styling Approach

- TailwindCSS for utility classes
- Custom CSS for complex components
- GlobalStyle component for global styles
- Theme system supports dynamic color schemes and backgrounds

### Component Development

- Lazy load non-critical components for performance
- Use custom hooks for reusable logic
- Error boundaries wrap the entire app
- Prefer functional components with hooks over class components

## Important Notes

### Mental Health Context

This is a mental health support app for young people after psychiatric treatment. Handle sensitive content appropriately and maintain supportive, non-judgmental language.

### License & Privacy

- Project is **not open source** (proprietary license)
- Code is copyrighted and requires permission for use
- Be mindful of privacy when handling user data features
