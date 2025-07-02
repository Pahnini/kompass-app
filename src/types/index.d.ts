// src/types/index.d.ts

export type Goal = { id: string; title: string; text: string; completed: boolean };
export type Achievement = {
  type: string; id: string; title: string; text: string; date: string 
};
export type CalendarNote = { title: string; text: string };
export type CalendarNotes = { [date: string]: CalendarNote };
export type Symptom = { title: string; intensity: number };
export type Symptoms = { [date: string]: Symptom[] };
export type WordFile = { id: string; name: string; file: File; url: string };
export type Skill = string;

export type SidebarItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

declare namespace React {
  type ReactNode = unknown;
}

export type BackgroundOptions = {
  id: string;
  label: string;
  color: string;
  url?: string;
};

export type UserData = {
  username: string;
  goals: Goal[];
  achievements: Achievement[];
  calendarNotes: CalendarNotes;
  symptoms: Symptoms;
  favorites: string[];
  wordFiles: WordFile[];
  theme: string;
  onboardingCompleted?: boolean;
};
