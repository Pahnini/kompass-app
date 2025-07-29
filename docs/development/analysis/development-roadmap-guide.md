# 🗺️ Kompass-App Development Roadmap Guide

**A comprehensive, top-tier implementation guide for developing the Kompass-App through all phases.**

---

## 📋 Pre-Development Setup

### 1. Fix Current Critical Issues (Priority 0)

Before starting any phase, resolve the existing technical debt:

```bash
# 1. Create .eslintignore
echo "dist/\ndev-dist/\nnode_modules/\n*.min.js" > .eslintignore

# 2. Install missing dependencies
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# 3. Fix TypeScript errors
npm run type-check

# 4. Standardize localStorage usage
# Replace all direct localStorage calls with storageService
```

### 2. Environment Setup

```bash
# Create .env from example
cp .env.example .env
# Fill in your Supabase credentials
```

---

## 🚀 PHASE 1 – Stabilisierung & Core-Funktionen

### 1.1 TypeScript Vollständige Typisierung

**Objective:** Zero TypeScript errors, complete type safety

**Tasks:**

1. **Fix existing TS errors:**

   ```typescript
   // Remove unused imports in:
   // - src/App.tsx (WelcomeScreen)
   // - src/components/Loading.tsx (useContext)
   // - src/components/SmartLoading.tsx (useContext)
   // - src/views/MoodCompassView.tsx (useTranslation)

   // Fix SidebarItem type in src/data/navigation.tsx
   export interface SidebarItem {
     key: string;
     label: string;
     icon: React.ReactNode;
     // Remove 'path' or add it to interface if needed
   }
   ```

2. **Add missing type definitions:**

   ```typescript
   // src/types/environment.d.ts
   interface ImportMetaEnv {
     readonly VITE_SUPABASE_URL: string;
     readonly VITE_SUPABASE_ANON_KEY: string;
     readonly VITE_OPENAI_API_KEY: string;
   }
   ```

3. **Standardize storage service:**
   ```typescript
   // Replace all localStorage calls with storageService
   // Pattern: localStorage.getItem() → storageService.get()
   // Pattern: localStorage.setItem() → storageService.set()
   ```

### 1.2 MoodKompass Grafische Verbesserung

**Objective:** Interactive, animated mood compass with Framer Motion

**Implementation:**

```typescript
// src/components/MoodCompass.tsx
import { motion } from 'framer-motion';

const MoodCompass = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <motion.div
      className="mood-compass"
      animate={{ rotate: rotation }}
      transition={{ type: "spring", damping: 20 }}
    >
      <motion.div
        className="compass-needle"
        animate={{
          rotate: rotation,
          filter: selectedMood ? "drop-shadow(0 0 20px #0b9444)" : "none"
        }}
      />
      {/* Mood sectors around compass */}
    </motion.div>
  );
};
```

**CSS Improvements:**

```css
.mood-compass {
  background: radial-gradient(circle, #2f4f4f 0%, #1f2f2f 100%);
  box-shadow: 0 0 30px rgba(11, 148, 68, 0.3);
  border-radius: 50%;
}

.compass-needle {
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3));
  transition: filter 0.3s ease;
}
```

### 1.3 Lokale/Supabase Speicherung

**Objective:** Hybrid storage with offline-first approach

**Architecture:**

```typescript
// src/services/hybridStorage.ts
export class HybridStorageService {
  async saveMoodEntry(entry: MoodEntry) {
    // 1. Save locally first (immediate feedback)
    storageService.set(`mood_${entry.date}`, entry);

    // 2. Sync to Supabase if online and authenticated
    if (navigator.onLine && this.isAuthenticated()) {
      try {
        await supabase.from('mood_entries').upsert(entry);
        storageService.set(`synced_mood_${entry.date}`, true);
      } catch (error) {
        // Mark for retry when online
        this.addToSyncQueue('mood_entry', entry);
      }
    }
  }
}
```

### 1.4 Übersetzungen Strukturieren

**Objective:** Error-free, maintainable i18n system

**Structure:**

```json
// src/translations/de.json
{
  "navigation": {
    "home": "Startseite",
    "mood": "Stimmung",
    "skills": "Skills"
  },
  "moodCompass": {
    "title": "Wie fühlst du dich?",
    "emotions": {
      "happy": "Glücklich",
      "sad": "Traurig"
    }
  },
  "gamification": {
    "level": "Level {{level}}",
    "xp": "{{current}}/{{total}} XP"
  }
}
```

**Validation script:**

```bash
# scripts/validate-translations.js
const fs = require('fs');
const translations = ['de', 'en', 'tr'];

translations.forEach(lang => {
  try {
    JSON.parse(fs.readFileSync(`src/translations/${lang}.json`));
    console.log(`✅ ${lang}.json is valid`);
  } catch (error) {
    console.error(`❌ ${lang}.json has errors:`, error.message);
  }
});
```

---

## 🎮 PHASE 2 – Gamification & Motivation

### 2.1 Echtes XP-System

**Objective:** Meaningful progression based on real interactions

**Implementation:**

```typescript
// src/services/gamificationService.ts
export class GamificationService {
  private readonly XP_ACTIONS = {
    MOOD_ENTRY: 10,
    SKILL_COMPLETED: 25,
    DAILY_STREAK: 50,
    WEEK_COMPLETE: 100,
  };

  awardXP(action: keyof typeof this.XP_ACTIONS, metadata?: any) {
    const xp = this.XP_ACTIONS[action];
    const currentXP = storageService.get<number>('user_xp') || 0;
    const newXP = currentXP + xp;

    // Check for level up
    const currentLevel = this.calculateLevel(currentXP);
    const newLevel = this.calculateLevel(newXP);

    storageService.set('user_xp', newXP);

    if (newLevel > currentLevel) {
      this.triggerLevelUp(newLevel);
    }

    this.showXPAnimation(xp);
  }

  calculateLevel(xp: number): number {
    // Level 1: 0-100 XP, Level 2: 100-250 XP, etc.
    return Math.floor(Math.sqrt(xp / 50)) + 1;
  }
}
```

### 2.2 Badge-System

**Objective:** Visual achievement system with unlockable content

**Implementation:**

```typescript
// src/data/badges.ts
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: {
    type: 'streak' | 'total' | 'specific';
    value: number;
    action?: string;
  };
}

export const badges: Badge[] = [
  {
    id: 'first_mood',
    name: 'Erste Schritte',
    description: 'Deine erste Stimmung eingetragen',
    icon: '🌟',
    rarity: 'common',
    unlockCondition: { type: 'total', value: 1, action: 'mood_entry' },
  },
  {
    id: 'week_warrior',
    name: 'Wochen-Krieger',
    description: '7 Tage in Folge aktiv',
    icon: '⚔️',
    rarity: 'rare',
    unlockCondition: { type: 'streak', value: 7 },
  },
];
```

### 2.3 Quest-System

**Objective:** Weekly/monthly goals with progress tracking

**Implementation:**

```typescript
// src/types/quest.ts
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  progress: number;
  target: number;
  reward: {
    xp: number;
    badge?: string;
  };
  deadline: Date;
  completed: boolean;
}

// src/components/QuestTracker.tsx
export default function QuestTracker() {
  const { quests, updateQuestProgress } = useQuests();

  return (
    <div className="quest-tracker">
      {quests.map(quest => (
        <motion.div
          key={quest.id}
          className="quest-card"
          whileHover={{ scale: 1.02 }}
        >
          <h3>{quest.title}</h3>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
            />
          </div>
          <span>{quest.progress}/{quest.target}</span>
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 🤖 PHASE 3 – Digitale Begleitung: Nova & Skills

### 3.1 Nova Persönlichkeitssystem

**Objective:** Empathetic AI companion with customizable personality

**Implementation:**

```typescript
// src/types/nova.ts
export interface NovaPersonality {
  id: string;
  name: string;
  traits: {
    empathy: number; // 1-10
    humor: number; // 1-10
    directness: number; // 1-10
    encouragement: number; // 1-10
  };
  responsePatterns: {
    greeting: string[];
    encouragement: string[];
    advice: string[];
    farewell: string[];
  };
  avatar: {
    mood: 'neutral' | 'happy' | 'concerned' | 'excited';
    style: 'friendly' | 'professional' | 'casual';
  };
}

// src/services/novaService.ts
export class NovaService {
  generateResponse(context: string, userMood: string, personality: NovaPersonality) {
    const prompt = this.buildPrompt(context, userMood, personality);
    return this.callLLM(prompt);
  }

  private buildPrompt(context: string, mood: string, personality: NovaPersonality) {
    return `
      Du bist Nova, ein empathischer digitaler Begleiter für junge Menschen nach einem Klinikaufenthalt.
      
      Persönlichkeit:
      - Empathie: ${personality.traits.empathy}/10
      - Humor: ${personality.traits.humor}/10
      - Direktheit: ${personality.traits.directness}/10
      
      Aktuelle Situation: ${context}
      Nutzer-Stimmung: ${mood}
      
      Antworte in maximal 2-3 Sätzen, empathisch aber nicht aufdringlich.
    `;
  }
}
```

### 3.2 Skill-Karten-Modul

**Objective:** Interactive skill cards with progress tracking

**Implementation:**

```typescript
// src/types/skill.ts
export interface SkillCard {
  id: string;
  title: string;
  category: 'breathing' | 'mindfulness' | 'social' | 'creative';
  difficulty: 1 | 2 | 3;
  duration: number; // minutes
  description: string;
  steps: string[];
  reflectionQuestions: string[];
  completedCount: number;
  lastCompleted?: Date;
}

// src/components/SkillCard.tsx
export default function SkillCard({ skill }: { skill: SkillCard }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      className="skill-card"
      layoutId={skill.id}
      whileHover={{ y: -5 }}
    >
      <div className="skill-header">
        <h3>{skill.title}</h3>
        <span className="difficulty">{'⭐'.repeat(skill.difficulty)}</span>
      </div>

      {isActive ? (
        <SkillExecution
          skill={skill}
          currentStep={currentStep}
          onStepComplete={() => setCurrentStep(prev => prev + 1)}
          onComplete={() => handleSkillComplete(skill)}
        />
      ) : (
        <SkillPreview skill={skill} onStart={() => setIsActive(true)} />
      )}
    </motion.div>
  );
}
```

---

## 🎓 PHASE 4 – Schul- & Jugendhilfe-Modul

### 4.1 Rollenbasiertes System

**Objective:** Separate interfaces for students, teachers, and social workers

**Architecture:**

```typescript
// src/types/roles.ts
export type UserRole = 'student' | 'teacher' | 'social_worker' | 'admin';

export interface UserPermissions {
  canViewStudentData: boolean;
  canEditLearningPlan: boolean;
  canCreateAssignments: boolean;
  canAccessReports: boolean;
}

// src/services/roleService.ts
export class RoleService {
  getPermissions(role: UserRole): UserPermissions {
    const permissionMap: Record<UserRole, UserPermissions> = {
      student: {
        canViewStudentData: true,
        canEditLearningPlan: false,
        canCreateAssignments: false,
        canAccessReports: false,
      },
      teacher: {
        canViewStudentData: true,
        canEditLearningPlan: true,
        canCreateAssignments: true,
        canAccessReports: true,
      },
      // ... other roles
    };

    return permissionMap[role];
  }
}
```

### 4.2 Lernplan-Modul

**Objective:** File upload, progress tracking, communication tools

**Implementation:**

```typescript
// src/components/LearningPlan.tsx
export default function LearningPlan() {
  const { user } = useAuth();
  const permissions = usePermissions(user.role);

  return (
    <div className="learning-plan">
      <FileUploadArea
        disabled={!permissions.canEditLearningPlan}
        onUpload={handleFileUpload}
      />

      <ProgressTracker
        assignments={assignments}
        readonly={user.role === 'student'}
      />

      <CommunicationPanel
        participants={getParticipants(user.role)}
        onMessage={handleMessage}
      />
    </div>
  );
}

// src/services/fileService.ts
export class FileService {
  async uploadAssignment(file: File, metadata: AssignmentMetadata) {
    // 1. Validate file type and size
    if (!this.isValidFile(file)) {
      throw new Error('Invalid file type');
    }

    // 2. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('assignments')
      .upload(`${metadata.studentId}/${file.name}`, file);

    if (error) throw error;

    // 3. Create database record
    await supabase.from('learning_plan_files').insert({
      student_id: metadata.studentId,
      file_path: data.path,
      uploaded_by: metadata.uploadedBy,
      assignment_type: metadata.type
    });
  }
}
```

---

## 📱 PHASE 5 – PWA & Skalierung

### 5.1 PWA-Optimierung

**Objective:** Full offline functionality and app-like experience

**Implementation:**

```typescript
// vite.config.ts - Enhanced PWA config
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 3,
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },
});
```

### 5.2 Offline-Sync Service

**Objective:** Seamless data synchronization when online

**Implementation:**

```typescript
// src/services/offlineSync.ts
export class OfflineSyncService {
  private syncQueue: SyncItem[] = [];

  async syncWhenOnline() {
    if (!navigator.onLine) return;

    const queue = storageService.get<SyncItem[]>('sync_queue') || [];

    for (const item of queue) {
      try {
        await this.syncItem(item);
        this.removeFromQueue(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
        // Keep in queue for retry
      }
    }
  }

  addToSyncQueue(type: string, data: any) {
    const item: SyncItem = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.syncQueue.push(item);
    storageService.set('sync_queue', this.syncQueue);
  }
}
```

---

## 🎯 Implementation Best Practices

### 1. Testing Strategy

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Example test
// tests/components/MoodCompass.test.tsx
describe('MoodCompass', () => {
  it('should award XP when mood is submitted', async () => {
    render(<MoodCompass />);
    const happyButton = screen.getByText('Glücklich');

    fireEvent.click(happyButton);

    expect(mockAwardXP).toHaveBeenCalledWith('MOOD_ENTRY');
  });
});
```

### 2. Performance Optimization

```typescript
// src/hooks/useVirtualization.ts
export function useVirtualization(items: any[], containerHeight: number) {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    // Only render visible items for large lists
    const itemHeight = 60;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    setVisibleItems(items.slice(0, visibleCount + 5));
  }, [items, containerHeight]);

  return visibleItems;
}
```

### 3. Error Boundary Implementation

```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    this.logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### 4. Monitoring & Analytics

```typescript
// src/services/analyticsService.ts
export class AnalyticsService {
  trackUserAction(action: string, metadata?: Record<string, any>) {
    // Privacy-first analytics
    const event = {
      action,
      timestamp: Date.now(),
      sessionId: this.getAnonymousSessionId(),
      metadata: this.sanitizeMetadata(metadata),
    };

    // Queue for batch sending
    this.addToAnalyticsQueue(event);
  }

  private sanitizeMetadata(metadata: any) {
    // Remove any PII before sending
    const { userId, email, ...safe } = metadata || {};
    return safe;
  }
}
```

---

## 🔄 Phase Transition Checklist

### Before moving to next phase:

- [ ] All TypeScript errors resolved
- [ ] Unit tests pass with >80% coverage
- [ ] Performance benchmarks meet targets
- [ ] Accessibility audit completed
- [ ] Security review passed
- [ ] User testing feedback incorporated
- [ ] Documentation updated
- [ ] Code review completed

### Success Metrics per Phase:

- **Phase 1:** Zero TS errors, <3s load time, functional mood tracking
- **Phase 2:** Engagement increase >30%, XP system working, badges unlockable
- **Phase 3:** Nova response time <2s, skill completion rate >60%
- **Phase 4:** Multi-role system tested, file upload working, communication functional
- **Phase 5:** PWA score >90, offline functionality 100%, sync working

---

> This guide provides a comprehensive, production-ready approach to implementing each phase of the Kompass-App roadmap with modern development practices, proper testing, and scalability considerations.
