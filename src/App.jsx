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
  const { theme, setTheme, background, setBackground, availableThemes, availableBackgrounds } = useTheme();
  
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
    symptome,
    setSymptome,
    favorites,
    setFavorites,
    wordFiles,
    setWordFiles,
    hasGoalsReminder
  } = useUserData();
  
  // Use UI context
  const {
    showWelcome,
    setShowWelcome,
    current,
    setCurrent,
    isSidebarOpen,
    setIsSidebarOpen,
    showDS,
    setShowDS,
    onboarding,
    setOnboarding,
    quickEdit,
    setQuickEdit,
    handleSidebarNav
  } = useUI();

  const appViews = {
    home: (
      <HomeScreen
        username={username}
        setUsername={setUsername}
        quickItems={favorites}
        setQuickEdit={setQuickEdit}
        allItems={sidebarItems}
        setCurrent={setCurrent}
      />
    ),
    deinweg: (
      <DeinWeg
        goals={goals}
        setGoals={setGoals}
        achievements={achievements}
        setAchievements={setAchievements}
        calendarNotes={calendarNotes}
        setCalendarNotes={setCalendarNotes}
        symptome={symptome}
        setSymptome={setSymptome}
        shareErfolg={shareAchievement}
        showReminder={hasGoalsReminder}
        emojiList={emojiList}
        vorlagen={templates}
        onBack={() => setCurrent("home")}
      />
    ),
    skills: (
      <Skills
        shareSkill={shareSkill}
        wordFiles={wordFiles}
        setWordFiles={setWordFiles}
        skillsList={skillsList}
        onBack={() => setCurrent("home")}
      />
    ),
    designs: (
      <Designs
        theme={theme}
        setTheme={setTheme}
        background={background}
        setBackground={setBackground}
        themes={availableThemes}
        backgrounds={availableBackgrounds}
        onBack={() => setCurrent("home")}
      />
    ),
    notfall: (
      <Notfall
        hilfeWebsites={helpResources}
        onBack={() => setCurrent("home")}
      />
    ),
    guide: <Guide onBack={() => setCurrent("home")} />,
    chat: <Chatbot onBack={() => setCurrent("home")} />,
    quickedit: (
      <QuickEdit
        quickItems={favorites}
        setQuickItems={setFavorites}
        allItems={sidebarItems}
        onBack={() => setCurrent("home")}
      />
    ),
  };

  if (showWelcome)
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;

  return (
    <div>
      <GlobalStyle />
      <Sidebar
        items={sidebarItems}
        current={current}
        setCurrent={handleSidebarNav}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
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
        {quickEdit ? appViews.quickedit : appViews[current]}
      </main>
      {showDS && <DatenschutzModal onClose={() => setShowDS(false)} />}
      {onboarding && <OnboardingModal onClose={() => setOnboarding(false)} />}
    </div>
  );
}
