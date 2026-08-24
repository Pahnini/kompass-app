export interface TestTask {
  id: string;
  title: string;
  description: string;
  link?: {
    label: string;
    to: string;
  };
}

export const TEST_TASKS: TestTask[] = [
  {
    id: 'navigation',
    title: 'Orientierung prüfen',
    description: 'Öffne zwei Bereiche über das Menü und finde anschließend zurück zur Startseite.',
  },
  {
    id: 'design',
    title: 'Design wechseln',
    description:
      'Wähle eine andere Farbwelt und prüfe, ob Texte und Schaltflächen gut lesbar bleiben.',
    link: { label: 'Designs öffnen', to: '/designs' },
  },
  {
    id: 'background',
    title: 'Eigenen Hintergrund testen',
    description:
      'Lade testweise ein unkritisches Foto hoch und entferne es danach wieder. Das Bild bleibt in deinem Browser.',
    link: { label: 'Hintergrund öffnen', to: '/designs' },
  },
  {
    id: 'nova',
    title: 'Nova ausprobieren',
    description:
      'Nutze nur eine harmlose oder erfundene Situation. Teile keine echten Krisen-, Gesundheits- oder Kontaktdaten.',
    link: { label: 'Nova öffnen', to: '/nova' },
  },
  {
    id: 'voice-thought',
    title: 'Kurzen Gedanken festhalten',
    description:
      'Teste Sprache-zu-Text oder die Tastatureingabe mit einem harmlosen Beispielsatz. Speichere nur, wenn du das möchtest.',
    link: { label: 'Gedanken öffnen', to: '/gedanken' },
  },
  {
    id: 'help',
    title: 'Hilfebereich finden',
    description: 'Prüfe, ob du die Hinweise und Hilfekontakte schnell findest.',
    link: { label: 'Hilfe öffnen', to: '/notfall' },
  },
  {
    id: 'accessibility',
    title: 'Vorlesen oder Tastatur testen',
    description: 'Teste die Sprachausgabe oder navigiere mit der Tab-Taste durch eine Seite.',
    link: { label: 'Barrierefreiheit öffnen', to: '/barrierefreiheit' },
  },
  {
    id: 'mobile',
    title: 'Auf dem Smartphone prüfen',
    description: 'Achte darauf, ob Menü, Texte und Schaltflächen ohne Zoomen bedienbar sind.',
  },
];
