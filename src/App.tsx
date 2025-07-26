import { Session } from '@supabase/supabase-js';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AchievementPopup from './components/AchievementPopup';
import DatenschutzModal from './components/DatenschutzModal';
import GlobalStyle from './components/GlobalStyle';
import HomeScreen from './components/HomeScreen';
import NotFound from './components/NotFound';
import OnboardingModal from './components/OnboardingModal';
import Sidebar from './components/Sidebar';
import SmartLoading from './components/SmartLoading';
import { emojiList } from './data/emojis';
import { helpResources } from './data/helpResources';
import { sidebarItems } from './data/navigation';
import { templates } from './data/templates';
import { usePageTitle } from './hooks/usePageTitle';
import { useTheme } from './hooks/useTheme';
import { useUI } from './hooks/useUI';
import { useUserData } from './hooks/useUserData';
import AchievementsScreen from './screens/AchievementsScreen';
import { shareAchievement, shareSkill } from './utils/shareUtils';
import { supabase } from './utils/supabase';
import MoodCompassView from './views/MoodCompassView';
import SchoolSupportView from './views/SchoolSupport/SchoolSupportView';
import PanicScreen from './views/PanicScreen';
import OfflineToast from './components/OfflineToast';
import InstallPromptBanner from './components/InstallPromptBanner';
import UpdateToast from './components/UpdateToast';
import LandingPage from './components/LandingPage';
import { NovaAssistant } from './components/NovaAssistant';
import { useLocation } from 'react-router-dom';
import NovaSettings from './views/NovaSettings';

// Lazy-loaded Komponenten
const Chatbot = lazy(() => import('./components/Chatbot'));
const DeinWeg = lazy(() => import('./components/DeinWeg'));
const Designs = lazy(() => import('./components/Designs'));
const Guide = lazy(() => import('./components/Guide'));
const Notfall = lazy(() => import('./components/Notfall'));
const QuickEdit = lazy(() => import('./components/QuickEdit'));
const Skills = lazy(() => import('./components/Skills'));

function AuthenticatedApp() {
  usePageTitle();
  const { theme, background } = useTheme();
  const [latestAchievement, setLatestAchievement] = useState<string | null>(null);
  const location = useLocation();
  const path = location.pathname;

  let novaContext: 'free' | 'welcome' | 'mood' | 'skill' | 'goal' = 'free';
  if (path === '/') novaContext = 'welcome';
  if (path === '/mood') novaContext = 'mood';
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
    <div>
      <GlobalStyle />
      <Sidebar
        items={sidebarItems}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        favorites={favorites}
      />
      <main
        className="main-area"
        style={{
          background: background.url ? `url(${background.url}) center/cover` : theme.bg,
          minHeight: '100vh',
        }}
      >
        <Suspense fallback={<SmartLoading message="Seite wird geladen..." />}>
          <Routes>
            <Route
              path="/"
              element={
                <HomeScreen
                  username={username}
                  setUsername={setUsername}
                  quickItems={favorites}
                  allItems={sidebarItems}
                  setFavorites={setFavorites}
                />
              }
            />
            <Route path="/achievements" element={<AchievementsScreen />} />
            <Route path="/mood" element={<MoodCompassView />} />
            <Route path="/school" element={<SchoolSupportView />} />
            <Route path="/panic" element={<PanicScreen />} />
            <Route path="/nova" element={<NovaSettings />} />
            <Route
              path="/deinweg"
              element={
                <DeinWeg
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
                <Skills
                  shareSkill={shareSkill}
                  wordFiles={wordFiles}
                  setWordFiles={setWordFiles}
                  skillsList={skillsList}
                  setSkillsList={setSkillsList}
                />
              }
            />
            <Route path="/notfall" element={<Notfall helpResources={helpResources} />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route
              path="/quickedit"
              element={
                <QuickEdit
                  quickItems={favorites}
                  setQuickItems={setFavorites}
                  allItems={sidebarItems}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {onboarding && <OnboardingModal onClose={() => setOnboarding(false)} />}
      {!onboarding && showDS && (
        <DatenschutzModal
          onClose={() => setShowDS(false)}
          dsHinweis="Diese App speichert deine Daten lokal in deinem Browser. Es werden keine Daten an externe Server übertragen. Durch die Nutzung stimmst du der lokalen Speicherung zu."
        />
      )}
      {latestAchievement && (
        <AchievementPopup label={latestAchievement} onClose={() => setLatestAchievement(null)} />
      )}
      <OfflineToast />
      <InstallPromptBanner />
      <UpdateToast />

      {/* ✅ Nova ist global sichtbar (unten rechts) */}
      <div className="fixed bottom-6 left-[260px] z-[100]" style={{ maxWidth: '240px' }}>
        <NovaAssistant context={novaContext} />
      </div>
    </div>
  );
}

export default function App(): React.ReactElement {
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

  const SKIP_WELCOME = true;

  if (loading) {
    return <SmartLoading message="Verbindung wird hergestellt..." />;
  }

  if (!session && !SKIP_WELCOME) {
    return <LandingPage />;
  }
  return <AuthenticatedApp />;
}
