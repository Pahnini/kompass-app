import { Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import DatenschutzModal from "./components/DatenschutzModal";
import DeinWeg from "./components/DeinWeg";
import Designs from "./components/Designs";
import GlobalStyle from "./components/GlobalStyle";
import Guide from "./components/Guide";
import HomeScreen from "./components/HomeScreen";
import Notfall from "./components/Notfall";
import OnboardingModal from "./components/OnboardingModal";
import QuickEdit from "./components/QuickEdit";
import Sidebar from "./components/Sidebar";
import Skills from "./components/Skills";
import WelcomeScreen from "./components/WelcomeScreen";
import { emojiList } from "./data/emojis";
import { helpResources } from "./data/helpResources";
import { sidebarItems } from "./data/navigation.jsx";
import { skillsList } from "./data/skills";
import { templates } from "./data/templates";
import { useTheme } from "./hooks/useTheme";
import { useUI } from "./hooks/useUI";
import { useUserData } from "./hooks/useUserData";
import { shareAchievement, shareSkill } from "./utils/shareUtils";

export default function App() {
  // Use theme context
  const {
    theme,
    setTheme,
    background,
    setBackground,
    availableThemes,
    availableBackgrounds,
  } = useTheme();

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

  if (showWelcome)
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;

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
            path="/designs"
            element={
              <Designs
                theme={theme}
                setTheme={setTheme}
                background={background}
                setBackground={setBackground}
                themes={availableThemes}
                backgrounds={availableBackgrounds}
              />
            }
          />
          <Route
            path="/notfall"
            element={<Notfall helpResources={helpResources} />}
          />
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
        </Routes>
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
