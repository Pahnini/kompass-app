import { describe, expect, it } from 'vitest';
import { APP_VERSION } from '../../config/brand';
import { detectBrowser, detectDevice, testFeedbackSchema } from '../testFeedback';

const validFeedback = {
  category: 'general' as const,
  topics: ['navigation', 'content'] as const,
  featurePriorities: ['quick-thoughts', 'mood'] as const,
  missingFeature: 'Eine frei einstellbare Erinnerung wäre hilfreich.',
  rating: 4,
  deviceType: 'desktop' as const,
  browser: 'Edge',
  message: 'Die Navigation war gut verständlich.',
  completedTasks: ['navigation', 'design'],
  appVersion: APP_VERSION,
};

describe('test feedback validation', () => {
  it('accepts a data-minimal feedback entry', () => {
    expect(testFeedbackSchema.safeParse(validFeedback).success).toBe(true);
  });

  it('rejects messages that are too short or too long', () => {
    expect(testFeedbackSchema.safeParse({ ...validFeedback, message: 'kurz' }).success).toBe(false);
    expect(
      testFeedbackSchema.safeParse({ ...validFeedback, message: 'x'.repeat(1501) }).success
    ).toBe(false);
  });

  it('rejects invalid ratings and excessive task metadata', () => {
    expect(testFeedbackSchema.safeParse({ ...validFeedback, rating: 6 }).success).toBe(false);
    expect(
      testFeedbackSchema.safeParse({
        ...validFeedback,
        completedTasks: Array.from({ length: 11 }, (_, index) => `task-${index}`),
      }).success
    ).toBe(false);
  });

  it('requires one to six known feedback topics', () => {
    expect(testFeedbackSchema.safeParse({ ...validFeedback, topics: [] }).success).toBe(false);
    expect(
      testFeedbackSchema.safeParse({
        ...validFeedback,
        topics: [
          'navigation',
          'content',
          'design',
          'performance',
          'accessibility',
          'assistant',
          'voice-notes',
        ],
      }).success
    ).toBe(false);
    expect(
      testFeedbackSchema.safeParse({ ...validFeedback, topics: ['unknown-area'] }).success
    ).toBe(false);
  });

  it('requires one to five known feature priorities', () => {
    expect(testFeedbackSchema.safeParse({ ...validFeedback, featurePriorities: [] }).success).toBe(
      false
    );
    expect(
      testFeedbackSchema.safeParse({
        ...validFeedback,
        featurePriorities: [
          'quick-thoughts',
          'mood',
          'skills',
          'assistant',
          'reflection',
          'personalization',
        ],
      }).success
    ).toBe(false);
    expect(
      testFeedbackSchema.safeParse({
        ...validFeedback,
        featurePriorities: ['unknown-feature'],
      }).success
    ).toBe(false);
  });

  it('limits a missing feature suggestion to 300 characters', () => {
    expect(
      testFeedbackSchema.safeParse({ ...validFeedback, missingFeature: 'x'.repeat(301) }).success
    ).toBe(false);
  });
});

describe('anonymous environment labels', () => {
  it('stores only a short browser family instead of the full user agent', () => {
    expect(detectBrowser('Mozilla/5.0 Edg/128.0')).toBe('Edge');
    expect(detectBrowser('Mozilla/5.0 Chrome/128.0 Safari/537.36')).toBe('Chrome');
    expect(detectBrowser('unknown client details')).toBe('Other');
  });

  it('groups the viewport into a broad device category', () => {
    expect(detectDevice(390)).toBe('mobile');
    expect(detectDevice(900)).toBe('tablet');
    expect(detectDevice(1440)).toBe('desktop');
    expect(detectDevice(0)).toBe('unknown');
  });
});
