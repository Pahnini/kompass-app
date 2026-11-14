import { describe, expect, it } from 'vitest';
import fixtures from '../../../public/protection-fixtures.json';
import {
  assessProtectionText,
  DEFAULT_PROTECTION_SETTINGS,
  validateProtectionEntries,
  validateProtectionRecord,
  validateProtectionSettings,
  type ProtectionSettings,
} from '../protection';

describe('local protection filter', () => {
  fixtures.forEach((fixture, index) =>
    it(`evaluates shared Android/web example ${index + 1}`, () => {
      const settings: ProtectionSettings = {
        ...DEFAULT_PROTECTION_SETTINGS,
        level: (fixture.level ?? 'balanced') as ProtectionSettings['level'],
        categories: {
          ...DEFAULT_PROTECTION_SETTINGS.categories,
          ...(fixture.disabled ? { [fixture.disabled]: false } : {}),
        },
        customWords: fixture.customWords ?? [],
      };
      expect(assessProtectionText(fixture.text, settings)).toBe(fixture.expected);
    })
  );
  it('bounds and validates stored configuration without enabling automatic collection', () => {
    const settings = validateProtectionSettings({
      level: 'unsupported',
      categories: { sexism: false, threat: 'false' },
      autoCollect: 'true',
      customWords: [' ', 42, 'a.b', 'x'.repeat(90)],
    });
    expect(settings.level).toBe('balanced');
    expect(settings.autoCollect).toBe(false);
    expect(settings.categories.sexism).toBe(false);
    expect(settings.categories.threat).toBe(true);
    expect(settings.customWords).toEqual(['a.b', 'x'.repeat(60)]);
  });
  it('drops corrupt archive records, bounds text and avoids duplicate ids', () => {
    const entry = {
      id: 'one',
      text: 'a'.repeat(600),
      source: 'manual',
      category: 'insult',
      capturedAt: '2026-11-14T12:00:00Z',
    };
    expect(
      validateProtectionEntries([{}, { ...entry, capturedAt: 'invalid' }, entry, entry])
    ).toEqual([{ ...entry, text: 'a'.repeat(500) }]);
  });
  it('retains explicit removal of examples across reloads', () => {
    expect(
      validateProtectionRecord({
        dismissedExampleIds: ['schutz-beispiel-2', 'unexpected'],
        entries: [],
      }).dismissedExampleIds
    ).toEqual(['schutz-beispiel-2']);
  });
});
