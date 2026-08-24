alter table public.test_feedback
  add column if not exists feedback_topics text[] not null default '{}'::text[];

alter table public.test_feedback
  drop constraint if exists test_feedback_topics_check;

alter table public.test_feedback
  add constraint test_feedback_topics_check
  check (
    cardinality(feedback_topics) <= 6
    and feedback_topics <@ array[
      'navigation',
      'content',
      'design',
      'performance',
      'accessibility',
      'assistant',
      'voice-notes',
      'account'
    ]::text[]
  );

comment on column public.test_feedback.feedback_topics is
  'Up to six non-sensitive product areas selected by a tester.';
