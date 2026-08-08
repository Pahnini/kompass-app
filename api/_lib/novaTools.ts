import { tool } from 'ai';
import { z } from 'zod';

export const novaDestinations = {
  openSkills: {
    kind: 'navigation',
    path: '/skills',
    label: 'Skills öffnen',
    description: 'Praktische Strategien aus deiner Skill-Sammlung ansehen.',
  },
  openMoodCompass: {
    kind: 'navigation',
    path: '/mood',
    label: 'Mood-Kompass öffnen',
    description: 'Deine aktuelle Stimmung kurz einordnen.',
  },
  openGoals: {
    kind: 'navigation',
    path: '/deinweg',
    label: 'Meine Ziele öffnen',
    description: 'Einen kleinen nächsten Schritt planen.',
  },
  showHelpContacts: {
    kind: 'navigation',
    path: '/notfall',
    label: 'Hilfekontakte anzeigen',
    description: 'Telefonnummern und echte Anlaufstellen öffnen.',
  },
} as const;

const emptyInputSchema = z.strictObject({});

export const novaTools = {
  openSkills: tool({
    description:
      'Biete einen Button zur Skill-Sammlung an, wenn die Person eine konkrete Strategie zum Beruhigen oder Bewältigen möchte.',
    inputSchema: emptyInputSchema,
    strict: true,
    execute: async () => novaDestinations.openSkills,
  }),
  openMoodCompass: tool({
    description:
      'Biete einen Button zum Mood-Kompass an, wenn die Person ihre Stimmung einordnen oder reflektieren möchte.',
    inputSchema: emptyInputSchema,
    strict: true,
    execute: async () => novaDestinations.openMoodCompass,
  }),
  openGoals: tool({
    description:
      'Biete einen Button zu den Zielen an, wenn die Person einen kleinen nächsten Schritt planen möchte.',
    inputSchema: emptyInputSchema,
    strict: true,
    execute: async () => novaDestinations.openGoals,
  }),
  showHelpContacts: tool({
    description:
      'Biete einen Button zu echten Hilfekontakten an, wenn die Person Unterstützung durch andere Menschen braucht oder eine Krise beschreibt.',
    inputSchema: emptyInputSchema,
    strict: true,
    execute: async () => novaDestinations.showHelpContacts,
  }),
};
