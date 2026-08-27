export const featureCandidateIds = [
  'quick-thoughts',
  'mood',
  'skills',
  'assistant',
  'reflection',
  'personalization',
  'accessibility',
  'connections',
  'reminders',
  'school-transition',
  'help',
] as const;

export type FeatureCandidateId = (typeof featureCandidateIds)[number];

export interface FeatureCandidate {
  id: FeatureCandidateId;
  title: string;
  description: string;
  status: 'testable' | 'planned';
  link?: {
    label: string;
    to: string;
  };
}

export const FEATURE_CANDIDATES: FeatureCandidate[] = [
  {
    id: 'quick-thoughts',
    title: 'Gedanken sprechen oder tippen',
    description: 'Kurze Gedanken erfassen und erst auf Wunsch als privaten Eintrag speichern.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/gedanken' },
  },
  {
    id: 'mood',
    title: 'Stimmung einordnen',
    description: 'Ohne Diagnose kurz festhalten, wie sich der aktuelle Moment anfühlt.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/mood' },
  },
  {
    id: 'skills',
    title: 'Skills für den Alltag',
    description: 'Kleine Übungen finden, speichern und in passenden Situationen nutzen.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/skills' },
  },
  {
    id: 'assistant',
    title: 'Digitale Begleitung',
    description:
      'Gedanken sortieren und gezielt zu vorhandenen App-Bereichen weitergeleitet werden.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/nova' },
  },
  {
    id: 'reflection',
    title: 'Reflexion und nächste Schritte',
    description: 'Ziele, Tagesstruktur und kleine Fortschritte übersichtlich festhalten.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/deinweg' },
  },
  {
    id: 'personalization',
    title: 'Eigenes Design',
    description: 'Farben, Darstellung und auf Wunsch einen eigenen Hintergrund auswählen.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/designs' },
  },
  {
    id: 'accessibility',
    title: 'Vorlesen und Bedienhilfen',
    description: 'Texte anhören sowie Kontrast, Schrift und Tastaturbedienung anpassen.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/barrierefreiheit' },
  },
  {
    id: 'connections',
    title: 'Einträge bewusst verbinden',
    description: 'Nur nach Zustimmung Gedanken mit Stimmung, Reflexion oder Begleitung verknüpfen.',
    status: 'planned',
  },
  {
    id: 'reminders',
    title: 'Sanfte Erinnerungen',
    description:
      'Freiwillige Hinweise für Check-ins, Skills oder selbst gewählte nächste Schritte.',
    status: 'planned',
  },
  {
    id: 'school-transition',
    title: 'Schule und Übergänge',
    description: 'Pläne, Informationen und eigene Unterlagen für Schule oder Ausbildung bündeln.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/school' },
  },
  {
    id: 'help',
    title: 'Hilfe schnell finden',
    description: 'Vertrauenspersonen und wichtige Hilfekontakte ohne Umwege erreichbar machen.',
    status: 'testable',
    link: { label: 'Ausprobieren', to: '/notfall' },
  },
];
