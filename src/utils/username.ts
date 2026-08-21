const INVALID_LEGACY_USERNAMES = new Set(['{}', '[object Object]']);

export function normalizeUsername(value: unknown): string {
  if (typeof value !== 'string') return '';

  const normalized = value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 40);
  return INVALID_LEGACY_USERNAMES.has(normalized) ? '' : normalized;
}
