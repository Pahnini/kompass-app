import type { Session } from '@supabase/supabase-js';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AchievementPopup from './components/AchievementPopup';
import AccessibilityToolbar from './components/accessibility/AccessibilityToolbar';
import RouteAnnouncer from './components/accessibility/RouteAnnouncer';
import DatenschutzModal from './components/DatenschutzModal';
import GlobalStyle from './components/GlobalStyle';
import InstallPromptBanner from './components/InstallPromptBanner';
import { NovaAssistant } from './components/NovaAssistant';
import OfflineToast from './components/OfflineToast';
import OnboardingModal from './components/OnboardingModal';
import UpdateToast from './components/UpdateToast';
import Sidebar from './components/layout/Sidebar';
import MobileBottomNav from './components/layout/MobileBottomNav';
import SmartLoading from './components/ui/SmartLoading';
import PanicButton from './components/shared/PanicButton';
import { emojiList } from './data/emojis';
import { helpResources } from './data/helpResources';
import { sidebarItems } from './data/navigation';
import { templates } from './data/templates';
import { getBackgroundCss } from './data/backgrounds';
import { usePageTitle } from './hooks/usePageTitle';
import { useTheme } from './hooks/useTheme';
import { useUI } from './hooks/useUI';
import { useUserData } from './hooks/useUserData';
import AchievementsPage from './pages/AchievementsPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { shareAchievement, shareSkill } from './utils/shareUtils';
import { supabase } from './utils/supabase';
import MoodCompassView from './views/MoodCompassView';
import NovaSettings from './views/NovaSettings';
import PanicScreen from './views/PanicScreen';
import SchoolSupportView from './views/SchoolSupport/SchoolSupportView';
import './styles/MelforiaShell.css';

// Lazy-loaded Komponenten
const ChatPage = lazy(() => import('./pages/ChatPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const DesignsPage = lazy(() => import('./pages/DesignsPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const QuickEditPage = lazy(() => import('./pages/QuickEditPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage'));
const TestCenterPage = lazy(() => import('./pages/TestCenterPage'));
const QuickThoughtPage = lazy(() => import('./pages/QuickThoughtPage'));
const SafetyPlanPage = lazy(() => import('./pages/SafetyPlanPage'));

function AuthenticatedApp() {
  const { theme, background } = useTheme();
  const [latestAchievement, setLatestAchievement] = useState<string | null>(null);
  const location = useLocation();
  const path = location.pathname;

  let novaContext: 'free' | 'welcome' | 'mood' | 'skill' | 'goal' = 'free';
  if (path === '/') novaContext = 'welcome';
  if (path === '/mood') novaContext = 'mood';
  if (path === '/gedanken') novaContext = 'goal';
  if (path === '/skills') novaContext = 'skill';
  if (path === '/deinweg') novaContext = 'goal';

  const {
    username,
    setUsername,
    goals,
    setGoals,
    achievements,
    setAchievements,
    calendarNotes,
    setCalendarNotes,
    symptoms,
    setSymptoms,
    favorites,
    setFavorites,
    wordFiles,
    setWordFiles,
    skillsList,
    setSkillsList,
    skillsCompleted,
    setSkillsCompleted,
    hasGoalsReminder,
  } = useUserData();

  const { isSidebarOpen, setIsSidebarOpen, showDS, setShowDS, onboarding, setOnboarding } = useUI();

  useEffect(() => {
    if (achievements && achievements.length > 0) {
      const sorted = [...achievements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const newest = sorted[0];
      const lastShown = localStorage.getItem('lastAchievementShown');

      if (newest && newest.date !== lastShown) {
        const achievementText = newest.label || 'New Achievement';
        setLatestAchievement(achievementText);
        localStorage.setItem('lastAchievementShown', newest.date);
      }
    }
  }, [achievements]);

  return (
    <div className="melforia-app-shell">
      <GlobalStyle />
      <a href="#main-content" className="melforia-skip-link">
        Zum Hauptinhalt springen
      </a>
      <RouteAnnouncer />
      <Sidebar
        items={sidebarItems}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        favorites={favorites}
      />
      <main
        id="main-content"
        tabIndex={-1}
        data-speech-content="true"
        className="main-area melforia-main-area"
        style={{
          backgroundImage: getBackgroundCss(background, theme.bg),
          backgroundColor: theme.bg,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      >
        <Suspense fallback={<SmartLoading message="Seite wird geladen..." />}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  username={username}
                  setUsername={setUsername}
                  quickItems={favorites}
                  allItems={sidebarItems}
                  setFavorites={setFavorites}
                />
              }
            />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/mood" element={<MoodCompassView />} />
            <Route path="/gedanken" element={<QuickThoughtPage />} />
            <Route path="/school" element={<SchoolSupportView />} />
            <Route path="/panic" element={<PanicScreen />} />
            <Route path="/nova" element={<ChatPage />} />
            <Route path="/nova/settings" element={<NovaSettings />} />
            <Route
              path="/deinweg"
              element={
                <GoalsPage
                  goals={goals}
                  setGoals={setGoals}
                  achievements={achievements}
                  setAchievements={setAchievements}
                  calendarNotes={calendarNotes}
                  setCalendarNotes={setCalendarNotes}
                  symptoms={symptoms}
                  setSymptoms={setSymptoms}
                  shareAchievement={shareAchievement}
                  showReminder={hasGoalsReminder}
                  emojiList={emojiList}
                  templates={templates}
                />
              }
            />
            <Route
              path="/skills"
              element={
                <SkillsPage
                  shareSkill={shareSkill}
                  wordFiles={wordFiles}
                  setWordFiles={setWordFiles}
                  skillsList={skillsList}
                  setSkillsList={setSkillsList}
                  skillsCompleted={skillsCompleted}
                  setSkillsCompleted={setSkillsCompleted}
                />
              }
            />
            <Route path="/notfall" element={<EmergencyPage helpResources={helpResources} />} />
            <Route path="/sicherheitsplan" element={<SafetyPlanPage />} />
            <Route path="/designs" element={<DesignsPage />} />
            <Route path="/barrierefreiheit" element={<AccessibilityPage />} />
            <Route path="/testen" element={<TestCenterPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route
              path="/quickedit"
              element={
                <QuickEditPage
                  quickItems={favorites}
                  setQuickItems={setFavorites}
                  allItems={sidebarItems}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {onboarding && <OnboardingModal onClose={() => setOnboarding(false)} />}
      {!onboarding && showDS && (
        <DatenschutzModal
          onClose={() => setShowDS(false)}
          dsHinweis="Wenn du Nova nutzt, werden deine Eingaben verschlüsselt an unseren KI-Dienst übertragen, um eine Antwort zu erzeugen. Der Nova-Chat wird in Version 0.1 nicht von uns gespeichert. Andere App-Daten werden entsprechend der jeweiligen Funktion verarbeitet."
        />
      )}
      {latestAchievement && (
        <AchievementPopup label={latestAchievement} onClose={() => setLatestAchievement(null)} />
      )}
      <OfflineToast />
      <InstallPromptBanner />
      <UpdateToast />
      <AccessibilityToolbar />
      <MobileBottomNav onOpenMenu={() => setIsSidebarOpen(true)} />
      {path !== '/panic' && <PanicButton />}

      {/* ✅ Nova ist global sichtbar (unten rechts) */}
      <div className="melforia-nova-assistant">
        <NovaAssistant context={novaContext} />
      </div>
    </div>
  );
}

export default function App(): React.ReactElement {
  usePageTitle();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setShowWelcome } = useUI();

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase client is not initialized.');
      setLoading(false);
      return;
    }

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      setShowWelcome(false);
    }
  }, [session, setShowWelcome]);

  if (loading) {
    return <SmartLoading message="Verbindung wird hergestellt..." />;
  }

  // If there's a session, show the authenticated app
  if (session) {
    return <AuthenticatedApp />;
  }

  // If no session, show public routes (landing, login)
  return (
    <div>
      <GlobalStyle />
      <a href="#main-content" className="melforia-skip-link">
        Zum Hauptinhalt springen
      </a>
      <RouteAnnouncer />
      <main id="main-content" tabIndex={-1} data-speech-content="true">
        <Suspense fallback={<SmartLoading message="Seite wird geladen..." />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/panic" element={<PanicScreen />} />
            <Route path="/notfall" element={<EmergencyPage helpResources={helpResources} />} />
            <Route path="/gedanken" element={<Navigate to="/login" replace />} />
            <Route path="/barrierefreiheit" element={<AccessibilityPage />} />
            <Route path="/testen" element={<TestCenterPage />} />
            {/* Redirect any other routes to landing when not authenticated */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Suspense>
      </main>
      <OfflineToast />
      <InstallPromptBanner />
      <UpdateToast />
      <AccessibilityToolbar />
      {location.pathname !== '/panic' && <PanicButton />}
    </div>
  );
}
