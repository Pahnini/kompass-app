import { describe, expect, it } from 'vitest';
import {
  backgrounds,
  createCustomBackground,
  CUSTOM_BACKGROUND_ID,
  getBackgroundCss,
} from '../backgrounds';

describe('Melforia backgrounds', () => {
  it('provides local gradient presets without remote image URLs', () => {
    expect(backgrounds).toHaveLength(4);
    expect(backgrounds.every(background => background.kind === 'gradient')).toBe(true);
    expect(backgrounds.every(background => background.value.startsWith('linear-gradient('))).toBe(
      true
    );
  });

  it('creates a selectable personal photo background', () => {
    const background = createCustomBackground('blob:melforia-photo', 'mein-foto.webp');

    expect(background.id).toBe(CUSTOM_BACKGROUND_ID);
    expect(background.isCustom).toBe(true);
    expect(getBackgroundCss(background, '#ffffff')).toBe('url("blob:melforia-photo")');
  });
});
