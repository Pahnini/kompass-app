import { describe, expect, it } from 'vitest';
import { getNavigationPath, primaryNavigationKeys, sidebarItems } from '../navigation';

describe('Melforia navigation', () => {
  it('keeps every navigation key unique', () => {
    const keys = sidebarItems.map(item => item.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('contains every primary mobile destination in the full menu', () => {
    const keys = new Set(sidebarItems.map(item => item.key));
    for (const key of primaryNavigationKeys) expect(keys.has(key)).toBe(true);
  });

  it('maps home and feature keys to the expected routes', () => {
    expect(getNavigationPath('home')).toBe('/');
    expect(getNavigationPath('mood')).toBe('/mood');
    expect(getNavigationPath('nova')).toBe('/nova');
  });
});
