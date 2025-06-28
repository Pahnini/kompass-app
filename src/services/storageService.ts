import { Achievement, CalendarNotes, Goal, Symptoms, WordFile } from "../types";

// ---------- USERNAME ----------
export function getUsername(): string {
  return localStorage.getItem("kompass_username") || "";
}
export function setUsername(username: string): void {
  localStorage.setItem("kompass_username", username);
}

// ---------- GOALS ----------
export function getGoals(): Goal[] {
  const data = localStorage.getItem("kompass_goals");
  return data ? JSON.parse(data) : [];
}
export function setGoals(goals: Goal[]): void {
  localStorage.setItem("kompass_goals", JSON.stringify(goals));
}

// ---------- ACHIEVEMENTS ----------
export function getAchievements(): Achievement[] {
  const data = localStorage.getItem("kompass_achievements");
  return data ? JSON.parse(data) : [];
}
export function setAchievements(achievements: Achievement[]): void {
  localStorage.setItem("kompass_achievements", JSON.stringify(achievements));
}

// ---------- CALENDAR ----------
export function getCalendarNotes(): CalendarNotes {
  const data = localStorage.getItem("kompass_calendar_notes");
  return data ? JSON.parse(data) : {};
}
export function setCalendarNotes(notes: CalendarNotes): void {
  localStorage.setItem("kompass_calendar_notes", JSON.stringify(notes));
}

// ---------- SYMPTOMS ----------
export function getSymptome(): Symptoms {
  const data = localStorage.getItem("kompass_symptoms");
  return data ? JSON.parse(data) : {};
}
export function setSymptome(symptoms: Symptoms): void {
  localStorage.setItem("kompass_symptoms", JSON.stringify(symptoms));
}

// ---------- FAVORITES ----------
export function getFavorites(): string[] {
  const data = localStorage.getItem("kompass_favorites");
  return data ? JSON.parse(data) : [];
}
export function setFavorites(favorites: string[]): void {
  localStorage.setItem("kompass_favorites", JSON.stringify(favorites));
}

// ---------- WORDFILES ----------
export function getWordFiles(): WordFile[] {
  const data = localStorage.getItem("kompass_word_files");
  return data ? JSON.parse(data) : [];
}
export function setWordFiles(files: WordFile[]): void {
  localStorage.setItem("kompass_word_files", JSON.stringify(files));
}

// ---------- THEME ----------
export function getTheme(): string {
  return localStorage.getItem("kompass_theme") || "Modern Blue-Grey";
}
export function setTheme(theme: string): void {
  localStorage.setItem("kompass_theme", theme);
}

// ---------- ONBOARDING ----------
export function getOnboardingCompleted(): boolean {
  return localStorage.getItem("kompass_onboarding") === "true";
}
export function setOnboardingCompleted(): void {
  localStorage.setItem("kompass_onboarding", "true");
}

// ---------- DATENSCHUTZ ----------
export function getDsAccepted(): boolean {
  return localStorage.getItem("kompass_ds_accepted") === "true";
}
export function setDsAccepted(): void {
  localStorage.setItem("kompass_ds_accepted", "true");
}

// ---------- SIDEBAR HINT ----------
export function getSidebarHintShown(): boolean {
  return localStorage.getItem("kompass_sidebar_hint") === "true";
}
export function setSidebarHintShown(): void {
  localStorage.setItem("kompass_sidebar_hint", "true");
}
