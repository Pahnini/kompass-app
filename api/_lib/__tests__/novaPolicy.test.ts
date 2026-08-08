import { describe, expect, it } from 'vitest';
import { getLatestUserText, hasCrisisSignal } from '../novaPolicy';
import { classifyNovaIntent, createNovaRuleReply } from '../novaRules';

describe('Nova safety policy', () => {
  it.each([
    'Ich will nicht mehr leben.',
    'Ich möchte sterben',
    'Ich denke an Suizid.',
    'Ich will mir etwas antun.',
    'I want to kill myself',
  ])('recognizes a direct crisis signal: %s', message => {
    expect(hasCrisisSignal(message)).toBe(true);
  });

  it.each([
    'Ich bin heute sehr gestresst.',
    'Hilf mir, ein kleines Ziel zu finden.',
    'Welche Skills gibt es?',
  ])('does not classify an ordinary request as a crisis: %s', message => {
    expect(hasCrisisSignal(message)).toBe(false);
  });

  it('reads only the latest user text', () => {
    expect(
      getLatestUserText([
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Erste Nachricht' }] },
        { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Antwort' }] },
        { id: '3', role: 'user', parts: [{ type: 'text', text: 'Letzte Nachricht' }] },
      ])
    ).toBe('Letzte Nachricht');
  });
});

describe('Nova free rule mode', () => {
  it.each([
    ['Ich möchte etwas tun, um runterzukommen.', 'calm', 'openSkills'],
    ['Ich möchte meine Gefühle einordnen.', 'mood', 'openMoodCompass'],
    ['Hilf mir, meine Gedanken kurz zu sortieren.', 'mood', 'openMoodCompass'],
    ['Hilf mir, meinen Tag besser zu strukturieren.', 'plan', 'openGoals'],
    ['Ich brauche einen Kontakt zum Reden.', 'contact', 'showHelpContacts'],
  ] as const)('maps %s to one bounded app tool', (message, intent, toolName) => {
    expect(classifyNovaIntent(message)).toBe(intent);
    expect(createNovaRuleReply(message).toolName).toBe(toolName);
  });

  it('answers an unknown request without inventing a tool action', () => {
    const reply = createNovaRuleReply('Hallo Nova');

    expect(classifyNovaIntent('Hallo Nova')).toBe('unknown');
    expect(reply.toolName).toBeUndefined();
    expect(reply.text).toContain('vier Dingen');
  });
});
