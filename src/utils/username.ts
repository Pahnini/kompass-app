const INVALID_LEGACY_USERNAMES = new Set(['{}', '[object Object]']);

export function normalizeUsername(value: unknown): string {
  if (typeof value !== 'string') return '';

  const normalized = Array.from(value)
    .filter(character => {
      const codePoint = character.charCodeAt(0);
      return codePoint >= 32 && codePoint !== 127;
    })
    .join('')
    .trim()
    .slice(0, 40);
  return INVALID_LEGACY_USERNAMES.has(normalized) ? '' : normalized;
}
