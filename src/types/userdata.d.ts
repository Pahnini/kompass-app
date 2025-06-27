// src/types/userdata.d.ts
export type Goal = {
  id: string;
  title: string;
  completed: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  date: string;
};

export type CalendarNotes = {
  [date: string]: string;
};

export type Symptoms = {
  [date: string]: string[];
};