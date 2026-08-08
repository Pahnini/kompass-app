export type NovaRuleToolName = 'openSkills' | 'openMoodCompass' | 'openGoals' | 'showHelpContacts';

export type NovaRuleIntent = 'calm' | 'mood' | 'plan' | 'contact' | 'unknown';

export interface NovaRuleReply {
  text: string;
  toolName?: NovaRuleToolName;
}

const intentPatterns: ReadonlyArray<{
  intent: Exclude<NovaRuleIntent, 'unknown'>;
  patterns: readonly RegExp[];
}> = [
  {
    intent: 'contact',
    patterns: [
      /\b(?:kontakt|hotline|telefonseelsorge|beratungsstelle|hilfekontakt)\b/u,
      /\b(?:mit )?jemand(?:em|en)? (?:reden|sprechen)\b/u,
      /\b(?:echte hilfe|vertrauensperson|ansprechperson)\b/u,
    ],
  },
  {
    intent: 'calm',
    patterns: [
      /\b(?:runter(?:zu)?kommen|beruhigen|entspannen|durchatmen)\b/u,
      /\b(?:stress|gestresst|uberfordert|unruhig|angespannt|panik)\b/u,
      /\b(?:skill|skills|achtsamkeit|atemubung)\b/u,
    ],
  },
  {
    intent: 'mood',
    patterns: [
      /\b(?:gefuhl|gefuhle|stimmung|mood|traurig|wutend|angstlich|einsam)\b/u,
      /\b(?:gedanken|mich|alles) (?:kurz )?(?:zu )?sortieren\b/u,
      /\b(?:einordnen|reflektieren)\b/u,
    ],
  },
  {
    intent: 'plan',
    patterns: [
      /\b(?:tag|alltag|aufgabe|aufgaben|hausaufgabe|hausaufgaben) (?:besser )?(?:planen|strukturieren|organisieren)\b/u,
      /\b(?:plan|ziel|ziele|nachster schritt|anfangen|priorisieren|strukturieren|organisieren)\b/u,
      /\b(?:erledigen|to-do|todo)\b/u,
    ],
  },
];

function normalizeForRules(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('de-DE');
}

export function classifyNovaIntent(text: string): NovaRuleIntent {
  const normalizedText = normalizeForRules(text);

  for (const matcher of intentPatterns) {
    if (matcher.patterns.some(pattern => pattern.test(normalizedText))) {
      return matcher.intent;
    }
  }

  return 'unknown';
}

export function createNovaRuleReply(text: string): NovaRuleReply {
  switch (classifyNovaIntent(text)) {
    case 'contact':
      return {
        text: 'Du musst damit nicht allein bleiben. Unter den Hilfekontakten findest du echte Ansprechpersonen. Wenn du unmittelbar in Gefahr bist, ruf bitte 112 an.',
        toolName: 'showHelpContacts',
      };
    case 'calm':
      return {
        text: 'Du musst gerade nicht alles auf einmal lösen. In deiner Skill-Sammlung kannst du eine kurze Strategie zum Runterkommen auswählen.',
        toolName: 'openSkills',
      };
    case 'mood':
      return {
        text: 'Du kannst zuerst kurz einordnen, was gerade da ist, ohne es sofort lösen zu müssen. Der Mood-Kompass hilft dir dabei Schritt für Schritt.',
        toolName: 'openMoodCompass',
      };
    case 'plan':
      return {
        text: 'Lass uns klein anfangen: Wähle nur eine Sache, die als Nächstes dran ist. Unter „Meine Ziele“ kannst du daraus einen überschaubaren Schritt machen.',
        toolName: 'openGoals',
      };
    default:
      return {
        text: 'Ich kann dich gerade bei vier Dingen begleiten: runterkommen, deine Stimmung einordnen, einen nächsten Schritt planen oder Hilfekontakte finden. Was passt am ehesten?',
      };
  }
}
