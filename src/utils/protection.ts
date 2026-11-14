import rawRules from '../../public/protection-rules.json';

export const PROTECTION_CATEGORIES = {
  sexism: 'Sexismus',
  insult: 'Beleidigungen',
  body: 'Bodyshaming',
  harassment: 'Belästigung',
  threat: 'Drohungen',
} as const;
export type ProtectionCategory = keyof typeof PROTECTION_CATEGORIES;
export type ProtectionMatch = ProtectionCategory | 'custom';
export interface ProtectionSettings {
  level: 'gentle' | 'balanced' | 'strict';
  categories: Record<ProtectionCategory, boolean>;
  customWords: string[];
  autoCollect: boolean;
}
export interface ProtectionEntry {
  id: string;
  text: string;
  category: ProtectionMatch | 'manual';
  capturedAt: string;
  source: 'example' | 'manual' | 'instagram' | 'native-demo';
}
export interface ProtectionRecord {
  settings: ProtectionSettings;
  entries: ProtectionEntry[];
  dismissedExampleIds: string[];
}
export const DEFAULT_PROTECTION_SETTINGS: ProtectionSettings = {
  level: 'balanced',
  categories: { sexism: true, insult: true, body: true, harassment: true, threat: true },
  customWords: [],
  autoCollect: false,
};
export const EMPTY_PROTECTION_RECORD: ProtectionRecord = {
  settings: DEFAULT_PROTECTION_SETTINGS,
  entries: [],
  dismissedExampleIds: [],
};
export const PROTECTION_STORAGE_KEY = 'melforia_digital_protection_v1';
const patterns = rawRules.map(rule => ({ ...rule, pattern: new RegExp(rule.pattern, 'u') }));
export const PROTECTION_LABELS = {
  ...PROTECTION_CATEGORIES,
  custom: 'Eigene Wortregel',
  manual: 'Manuell gesichert',
};
export function normalizeProtectionText(text: string): string {
  return text
    .normalize('NFKC')
    .toLocaleLowerCase('de-DE')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
export function assessProtectionText(
  text: string,
  settings: ProtectionSettings
): ProtectionMatch | null {
  const normalized = normalizeProtectionText(text.slice(0, 500));
  if (settings.customWords.some(word => normalized.includes(normalizeProtectionText(word))))
    return 'custom';
  const minimum = { gentle: 3, balanced: 2, strict: 1 }[settings.level];
  for (const rule of patterns) {
    const category = rule.category as ProtectionCategory;
    if (settings.categories[category] && rule.severity >= minimum && rule.pattern.test(normalized))
      return category;
  }
  return null;
}
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function validateProtectionSettings(value: unknown): ProtectionSettings {
  if (!isObject(value)) return structuredClone(DEFAULT_PROTECTION_SETTINGS);
  const categories = { ...DEFAULT_PROTECTION_SETTINGS.categories };
  if (isObject(value.categories))
    for (const key of Object.keys(categories) as ProtectionCategory[]) {
      if (typeof value.categories[key] === 'boolean') categories[key] = value.categories[key];
    }
  return {
    level: value.level === 'gentle' || value.level === 'strict' ? value.level : 'balanced',
    categories,
    autoCollect: value.autoCollect === true,
    customWords: Array.isArray(value.customWords)
      ? [
          ...new Set(
            value.customWords
              .filter((word): word is string => typeof word === 'string')
              .map(word => word.trim().slice(0, 60))
              .filter(Boolean)
          ),
        ].slice(0, 40)
      : [],
  };
}
export function validateProtectionEntries(value: unknown): ProtectionEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const entries: ProtectionEntry[] = [];
  for (const item of value) {
    if (
      !isObject(item) ||
      typeof item.id !== 'string' ||
      !item.id ||
      item.id.length > 100 ||
      seen.has(item.id) ||
      typeof item.text !== 'string' ||
      typeof item.capturedAt !== 'string' ||
      !Number.isFinite(Date.parse(item.capturedAt))
    )
      continue;
    if (!['example', 'manual', 'instagram', 'native-demo'].includes(String(item.source))) continue;
    const category =
      typeof item.category === 'string' && Object.hasOwn(PROTECTION_LABELS, item.category)
        ? (item.category as ProtectionEntry['category'])
        : 'manual';
    entries.push({
      id: item.id,
      text: item.text.slice(0, 500),
      category,
      capturedAt: item.capturedAt,
      source: item.source as ProtectionEntry['source'],
    });
    seen.add(item.id);
    if (entries.length === 200) break;
  }
  return entries;
}
export function validateProtectionRecord(value: unknown): ProtectionRecord {
  return {
    settings: validateProtectionSettings(isObject(value) ? value.settings : null),
    entries: validateProtectionEntries(isObject(value) ? value.entries : null),
    dismissedExampleIds:
      isObject(value) && Array.isArray(value.dismissedExampleIds)
        ? value.dismissedExampleIds
            .filter(
              (id): id is string => typeof id === 'string' && /^schutz-beispiel-[1-6]$/.test(id)
            )
            .slice(0, 6)
        : [],
  };
}
export function exportProtectionEntries(entries: ProtectionEntry[]): void {
  const payload = {
    title: 'Melforia · Digitaler Schutz',
    exportedAt: new Date().toISOString(),
    note: 'Textsammlung zur persönlichen Durchsicht. Keine Screenshots oder verifizierten Originalnachweise. capturedAt bezeichnet den Sicherungszeitpunkt. Beispieltexte sind als example oder native-demo gekennzeichnet; manuelle Texte haben keine verifizierte Quelle. Instagram-Einträge enthalten nur zugänglichen Text, keine verifizierte Profilzuordnung.',
    entries,
  };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `melforia-schutz-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
