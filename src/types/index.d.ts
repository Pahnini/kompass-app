// src/types/index.d.ts

export type Goal = {
  id: string;
  title: string;
  completed: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  date: string; // oder Date
};

export type CalendarNotes = {
  [date: string]: string;
};

export type Symptoms = {
  [date: string]: string[];
};

export type WordFile = {
  id: string;
  name: string;
  file: File; // oder Blob, je nach App-Usecase
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
