import { z } from 'zod';
import { APP_VERSION } from '../config/brand';

export const feedbackCategories = ['general', 'bug', 'nova', 'accessibility', 'design'] as const;
export const feedbackTopics = [
  'navigation',
  'content',
  'design',
  'performance',
  'accessibility',
  'assistant',
  'voice-notes',
  'account',
] as const;
export const deviceTypes = ['mobile', 'tablet', 'desktop', 'unknown'] as const;

export const testFeedbackSchema = z.object({
  category: z.enum(feedbackCategories),
  topics: z.array(z.enum(feedbackTopics)).min(1).max(6),
  rating: z.number().int().min(1).max(5),
  deviceType: z.enum(deviceTypes),
  browser: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(1500),
  completedTasks: z.array(z.string().min(1).max(40)).max(10),
  appVersion: z.literal(APP_VERSION),
});

export type TestFeedbackInput = z.infer<typeof testFeedbackSchema>;
export type FeedbackCategory = (typeof feedbackCategories)[number];
export type FeedbackTopic = (typeof feedbackTopics)[number];
export type DeviceType = (typeof deviceTypes)[number];

export function detectBrowser(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) return 'Edge';
  if (/Firefox\//i.test(userAgent)) return 'Firefox';
  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) return 'Chrome';
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return 'Safari';
  return 'Other';
}

export function detectDevice(width: number): DeviceType {
  if (!Number.isFinite(width) || width <= 0) return 'unknown';
  if (width < 700) return 'mobile';
  if (width < 1100) return 'tablet';
  return 'desktop';
}
