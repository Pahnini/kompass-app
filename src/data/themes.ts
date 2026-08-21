// Theme definitions for the application
// import type { Theme } from "../data/themes";
export type ThemeName = 'Modern Blue-Grey' | 'Gruen' | 'Classic' | 'Night';

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
  bg: '#203247',
  primary: '#2d4259',
  accent: '#72adf0',
  font: "'Poppins', 'Segoe UI', sans-serif",
  dark: true,
  secondary: '#a9ccf5',
  text: '#f4f7fb',
  background: '#203247',
};

export const themes: Theme[] = [
  modernBlueGrey,
  {
    name: 'Gruen',
    bg: '#f6fefa',
    primary: '#0b9444',
    accent: '#69c86a',
    font: "'Poppins', Arial, sans-serif",
    dark: false,
    secondary: '#b9ead5',
    text: '#173d37',
    background: '#f6fefa',
  },
  {
    name: 'Classic',
    bg: '#ffffff',
    primary: '#2a6b3d',
    accent: '#9acaaa',
    font: "'Roboto', Arial, sans-serif",
    dark: false,
    secondary: '#d7eadc',
    text: '#20352a',
    background: '#ffffff',
  },
  {
    name: 'Night',
    bg: '#22252a',
    primary: '#b1ffbb',
    accent: '#12b985',
    font: "'Share Tech Mono', monospace",
    dark: true,
    secondary: '#8ce9ca',
    text: '#f4fff9',
    background: '#22252a',
  },
];

export default themes;
