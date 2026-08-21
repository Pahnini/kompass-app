import { describe, expect, it } from 'vitest';
import { normalizeUsername } from '../username';

describe('normalizeUsername', () => {
  it('keeps a valid name and trims whitespace', () => {
    expect(normalizeUsername('  Alex  ')).toBe('Alex');
  });

  it('hides invalid values created by the legacy username save bug', () => {
    expect(normalizeUsername('{}')).toBe('');
    expect(normalizeUsername('[object Object]')).toBe('');
    expect(normalizeUsername({})).toBe('');
  });
});
