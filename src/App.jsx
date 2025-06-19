import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Compass,
  Sparkles,
  Paintbrush,
  AlertCircle,
  Info,
  MessageCircle,
  Settings,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import HomeScreen from "./components/HomeScreen";
import DeinWeg from "./components/DeinWeg";
import Skills from "./components/Skills";
import Designs from "./components/Designs";
import Notfall from "./components/Notfall";
import Guide from "./components/Guide";
import Chatbot from "./components/Chatbot";
import DatenschutzModal from "./components/DatenschutzModal";
import OnboardingModal from "./components/OnboardingModal";
import QuickAccess from "./components/QuickAccess";
import QuickEdit from "./components/QuickEdit";
import GlobalStyle from "./components/GlobalStyle";
import WelcomeScreen from "./components/WelcomeScreen";

// --- Farben, Themes, Backgrounds ---
const modernBlueGrey = {
  name: "Modern Blue-Grey",
  bg: "#f0f4f8",
  primary: "#2f4f4f",
  accent: "#5dade2",
  font: "'Poppins', sans-serif",
  dark: false,
};

const themes = [
  modernBlueGrey,
  {
    name: "Asklepios",
    bg: "#f6fefa",
    primary: "#0b9444",
    accent: "#69c86a",
    font: "'Poppins', Arial, sans-serif",
    dark: false,
  },
  {
    name: "Classic",
    bg: "#ffffff",
    primary: "#2a6b3d",
    accent: "#9acaaa",
    font: "'Roboto', Arial, sans-serif",
    dark: false,
  },
  {
    name: "Night",
    bg: "#22252a",
    primary: "#b1ffbb",
    accent: "#12b985",
    font: "'Share Tech Mono', monospace",
    dark: true,
  },
];
const backgrounds = [
  { name: "Clean", url: "" },
  {
    name: "Grün Verlauf",
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a01b2?auto=format&fit=crop&w=800&q=60",
  },
];

// --- Skills, Hilfe-Websites, Textbausteine etc. ---
const skillsList = [
  "Atemübung: 4-7-8",
  "Dankbarkeitstagebuch",
  "Achtsamkeitsübung (Bodyscan)",
  "Stretch & Move",
  "10min Handy aus",
  "Meditation",
  "Kreativ zeichnen",
  "Self-Care Snack",
  "Online-Freundschaft pflegen",
];
const vorlagen = [
  "Ich bin heute stolz auf mich, weil...",
  "Heute habe ich etwas Neues ausprobiert: ...",
  "Ich habe mir Zeit für mich genommen, indem ich...",
  "Ich habe jemandem geholfen und mich dabei gut gefühlt.",
];
const emojiList = [
  { emoji: "😃", label: "Glücklich" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😢", label: "Traurig" },
  { emoji: "😡", label: "Wütend" },
  { emoji: "😱", label: "Ängstlich" },
  { emoji: "🤩", label: "Aufgeregt" },
  { emoji: "🥱", label: "Müde" },
  { emoji: "😞", label: "Enttäuscht" },
];
const hilfeWebsites = [
  { name: "Nummer gegen Kummer", url: "https://www.nummergegenkummer.de/" },
  {
    name: "KJP Harburg (Asklepios)",
    url: "https://www.asklepios.com/harburg/abteilungen-spezialistinnen/abteilungen/kjpp",
  },
  { name: "JugendNotmail", url: "https://jugendnotmail.de/" },
  { name: "krisenchat.de", url: "https://krisenchat.de/" },
];
const dsHinweis =
  "Hey! Alles, was du hier machst, bleibt auf deinem Gerät. Keine Cloud, kein Tracking, keine Werbung. Dein Kompass = deine Daten. 🚀";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarItems] = useState([
    { key: "home", label: "Home", icon: <Home size={18} /> },
    { key: "deinweg", label: "Mein Kompass", icon: <Compass size={18} /> },
    { key: "skills", label: "Skills & Achtsamkeit", icon: <Sparkles size={18} /> },
    { key: "designs", label: "Designs", icon: <Paintbrush size={18} /> },
    { key: "notfall", label: "Notfall", icon: <AlertCircle size={18} /> },
    { key: "guide", label: "Guide", icon: <Info size={18} /> },
    { key: "chat", label: "Chatbot", icon: <MessageCircle size={18} /> },
    { key: "quickedit", label: "Homescreen anpassen", icon: <Settings size={18} /> },
  ]);

  const [theme, setTheme] = useState(() => modernBlueGrey);
  const [background, setBackground] = useState(() => backgrounds[0]);
  const [current, setCurrent] = useState("home");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("kompass_favorites")) || ["deinweg", "skills"]);
  const [username, setUsername] = useState(() => localStorage.getItem("kompass_username") || "");
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem("kompass_goals")) || []);
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem("kompass_achievements")) || []);
  const [calendarNotes, setCalendarNotes] = useState(() => JSON.parse(localStorage.getItem("kompass_calendar_notes")) || {});
  const [symptome, setSymptome] = useState(() => JSON.parse(localStorage.getItem("kompass_symptome")) || {});
  const [wordFiles, setWordFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDS, setShowDS] = useState(() => !localStorage.getItem("kompass_ds_accepted"));
  const [onboarding, setOnboarding] = useState(() => !localStorage.getItem("kompass_onboarding"));
  const [showGuide, setShowGuide] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [quickEdit, setQuickEdit] = useState(false);

  useEffect(() => localStorage.setItem("kompass_favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("kompass_username", username), [username]);
  useEffect(() => localStorage.setItem("kompass_goals", JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem("kompass_achievements", JSON.stringify(achievements)), [achievements]);
  useEffect(() => localStorage.setItem("kompass_calendar_notes", JSON.stringify(calendarNotes)), [calendarNotes]);
  useEffect(() => localStorage.setItem("kompass_symptome", JSON.stringify(symptome)), [symptome]);
  useEffect(() => { if (!showDS) localStorage.setItem("kompass_ds_accepted", "1") }, [showDS]);
  useEffect(() => { if (!onboarding) localStorage.setItem("kompass_onboarding", "1") }, [onboarding]);
  useEffect(() => {
    if (!localStorage.getItem("kompass_sidebar_hint")) {
      alert("Tipp: Über ☰ oben rechts erreichst du das Menü.");
      localStorage.setItem("kompass_sidebar_hint", "1");
    }
  }, []);

  function handleSidebarNav(key) {
    setCurrent(key);
    setIsSidebarOpen(false);
    setShowGuide(key === "guide");
    setShowChat(key === "chat");
    setQuickEdit(key === "quickedit");
  }

  function shareErfolg(e) {
    if (navigator.share) navigator.share({ title: "Erfolg", text: `${e.text} (${e.date})`, url: window.location.href });
    else alert("Teilen nicht unterstützt.");
  }

  function shareSkill(s) {
    if (navigator.share) navigator.share({ title: "Skill", text: s, url: window.location.href });
    else alert("Teilen nicht unterstützt.");
  }

  const appViews = {
    home: <HomeScreen username={username} setUsername={setUsername} quickItems={favorites} setQuickEdit={setQuickEdit} allItems={sidebarItems} setCurrent={setCurrent} />,
    deinweg: <DeinWeg goals={goals} setGoals={setGoals} achievements={achievements} setAchievements={setAchievements} calendarNotes={calendarNotes} setCalendarNotes={setCalendarNotes} symptome={symptome} setSymptome={setSymptome} shareErfolg={shareErfolg} showReminder={goals.length > 0 && !goals.some((g) => g.done)} emojiList={emojiList} vorlagen={vorlagen} onBack={() => setCurrent("home")} />,
    skills: <Skills shareSkill={shareSkill} wordFiles={wordFiles} setWordFiles={setWordFiles} skillsList={skillsList} onBack={() => setCurrent("home")} />,
    designs: <Designs theme={theme} setTheme={setTheme} background={background} setBackground={setBackground} themes={themes} backgrounds={backgrounds} onBack={() => setCurrent("home")} />,
    notfall: <Notfall hilfeWebsites={hilfeWebsites} onBack={() => setCurrent("home")} />,
    guide: <Guide onBack={() => setCurrent("home")} />,
    chat: <Chatbot onBack={() => setCurrent("home")} />,
    quickedit: <QuickEdit quickItems={favorites} setQuickItems={setFavorites} allItems={sidebarItems} onBack={() => setCurrent("home")} />,
  };

  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.fontFamily = theme.font;
    document.body.style.color = theme.dark ? "#fff" : "#222";
    document.body.className = theme.dark ? "night" : "";
  }, [theme]);

  const [toast, setToast] = useState("");
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1200);
  }

  if (showWelcome) return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;

  return (
    <div>
      <GlobalStyle />
      {toast && <div className="toast-success">{toast}</div>}
      <Sidebar items={sidebarItems} current={current} setCurrent={handleSidebarNav} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="main-area" style={{ background: background.url ? `url(${background.url}) center/cover` : theme.bg, minHeight: "100vh" }}>
        {quickEdit ? appViews.quickedit : appViews[current]}
      </main>
      {showDS && <DatenschutzModal onClose={() => setShowDS(false)} />} 
      {onboarding && <OnboardingModal onClose={() => setOnboarding(false)} />} 
    </div>
  );
}
