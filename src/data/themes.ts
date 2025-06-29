// Theme definitions for the application
// import type { Theme } from "../data/themes";
export type ThemeName = 'Modern Blue-Grey' | 'Asklepios' | 'Classic' | 'Night';

export type Theme = {
  name: ThemeName;
  bg: string;
  primary: string;
  accent: string;
  secondary: string;
  font: string;
  dark: boolean;
  text: string;
  background: string;
};

export const modernBlueGrey: Theme = {
  name: 'Modern Blue-Grey',
  bg: '#f0f4f8',
  primary: '#2f4f4f',
  accent: '#5dade2',
  font: "'Poppins', sans-serif",
  dark: false,
  secondary: '',
  text: '',
  background: '',
};

export const themes: Theme[] = [
  modernBlueGrey,
  {
    name: 'Asklepios',
    bg: '#f6fefa',
    primary: '#0b9444',
    accent: '#69c86a',
    font: "'Poppins', Arial, sans-serif",
    dark: false,
    secondary: '',
    text: '',
    background: '',
  },
  {
    name: 'Classic',
    bg: '#ffffff',
    primary: '#2a6b3d',
    accent: '#9acaaa',
    font: "'Roboto', Arial, sans-serif",
    dark: false,
    secondary: '',
    text: '',
    background: '',
  },
  {
    name: 'Night',
    bg: '#22252a',
    primary: '#b1ffbb',
    accent: '#12b985',
    font: "'Share Tech Mono', monospace",
    dark: true,
    secondary: '',
    text: '',
    background: '',
  },
];

export default themes;
