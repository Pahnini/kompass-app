import { describe, expect, it } from 'vitest';
import { collectReadableText } from '../readableText';

describe('collectReadableText', () => {
  it('collects structured page content in reading order', () => {
    const root = document.createElement('main');
    root.innerHTML = `
      <h1>Melforia</h1>
      <p>Ein ruhiger Ort.</p>
      <ul><li>Erster Schritt</li><li>Zweiter Schritt</li></ul>
    `;

    expect(collectReadableText(root)).toBe(
      'Melforia. Ein ruhiger Ort. Erster Schritt. Zweiter Schritt.'
    );
  });

  it('ignores hidden controls and the reading toolbar', () => {
    const root = document.createElement('main');
    root.innerHTML = `
      <h1>Sichtbarer Inhalt</h1>
      <div aria-hidden="true"><p>Versteckter Inhalt</p></div>
      <div class="melforia-reading-toolbar"><p>Vorlesen</p></div>
    `;

    expect(collectReadableText(root)).toBe('Sichtbarer Inhalt.');
  });
});
