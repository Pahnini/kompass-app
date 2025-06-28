import { Session } from "@supabase/supabase-js";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DatenschutzModal from "./components/DatenschutzModal";
import GlobalStyle from "./components/GlobalStyle";
import HomeScreen from "./components/HomeScreen";
import NotFound from "./components/NotFound";
import OnboardingModal from "./components/OnboardingModal";
import Sidebar from "./components/Sidebar";
import SmartLoading from "./components/SmartLoading";
import WelcomeScreen from "./components/WelcomeScreen";
import { emojiList } from "./data/emojis";
import { helpResources } from "./data/helpResources";
import { sidebarItems } from "./data/navigation";
import { skillsList } from "./data/skills";
import { templates } from "./data/templates";
import { usePageTitle } from "./hooks/usePageTitle";
import { useTheme } from "./hooks/useTheme";
import { useUI } from "./hooks/useUI";
import { useUserData } from "./hooks/useUserData";
import { shareAchievement, shareSkill } from "./utils/shareUtils";
import supabase from "./utils/supabase";

// Lazy load components for better performance
const Chatbot = lazy(() => import("./components/Chatbot"));
const DeinWeg = lazy(() => import("./components/DeinWeg"));
const Guide = lazy(() => import("./components/Guide"));
const Notfall = lazy(() => import("./components/Notfall"));
const Desings = lazy(() => import("./components/Designs"));
const QuickEdit = lazy(() => import("./components/QuickEdit"));
const Skills = lazy(() => import("./components/Skills"));

export default function App(): React.ReactElement {
  // Set page title based on current route
  usePageTitle();

  // Track authentication state
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for authentication on load and listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Use theme context
  const { theme, background } = useTheme();

  // Use user data context
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
    hasGoalsReminder,
  } = useUserData();

  // Use UI context
  const {
    showWelcome,
    setShowWelcome,
    isSidebarOpen,
    setIsSidebarOpen,
    showDS,
    setShowDS,
    onboarding,
    setOnboarding,
  } = useUI();

  // Show loading state while checking authentication
  if (loading) {
    return <SmartLoading message="Verbindung wird hergestellt..." />;
  }

  // Show welcome screen if not authenticated
  if (!session) {
    return <WelcomeScreen />;
  }

  // Skip welcome screen if authenticated
  if (showWelcome) {
    setShowWelcome(false);
  }

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
          background: background.url
            ? `url(${background.url}) center/cover`
            : theme.bg,
          minHeight: "100vh",
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
                />
              }
            />
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
                />
              }
            />

            <Route
              path="/notfall"
              element={<Notfall helpResources={helpResources} />}
            />
            <Route path="/desings" element={<Desings />} />
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
    </div>
  );
}
