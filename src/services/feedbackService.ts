import { supabase } from '../utils/supabase';
import { testFeedbackSchema, type TestFeedbackInput } from '../utils/testFeedback';

export class FeedbackAuthenticationError extends Error {
  constructor() {
    super('Bitte melde dich an, bevor du Feedback sendest.');
    this.name = 'FeedbackAuthenticationError';
  }
}

export async function submitTestFeedback(input: TestFeedbackInput): Promise<void> {
  // Paused until the feedback process and legal information have been reviewed.
  if (import.meta.env.VITE_FEEDBACK_ENABLED !== 'true')
    throw new Error('Die Feedbackübermittlung ist derzeit pausiert.');
  const parsed = testFeedbackSchema.parse(input);
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new FeedbackAuthenticationError();
  }

  const { error } = await supabase.from('test_feedback').insert({
    category: parsed.category,
    feedback_topics: parsed.topics,
    rating: parsed.rating,
    device_type: parsed.deviceType,
    browser: parsed.browser,
    message: parsed.message,
    completed_tasks: parsed.completedTasks,
    app_version: parsed.appVersion,
  });

  if (error) {
    throw new Error('Dein Feedback konnte gerade nicht gesendet werden. Bitte versuche es erneut.');
  }
}
