alter table public.test_feedback
  add column if not exists feature_priorities text[] not null default '{}'::text[],
  add column if not exists missing_feature text not null default '';

alter table public.test_feedback
  drop constraint if exists test_feedback_feature_priorities_check,
  drop constraint if exists test_feedback_missing_feature_check;

alter table public.test_feedback
  add constraint test_feedback_feature_priorities_check
  check (
    cardinality(feature_priorities) <= 5
    and feature_priorities <@ array[
      'quick-thoughts',
      'mood',
      'skills',
      'assistant',
      'reflection',
      'personalization',
      'accessibility',
      'connections',
      'reminders',
      'school-transition',
      'help'
    ]::text[]
  ),
  add constraint test_feedback_missing_feature_check
  check (char_length(missing_feature) <= 300);

comment on column public.test_feedback.feature_priorities is
  'Up to five non-sensitive product feature ids selected by a tester.';
comment on column public.test_feedback.missing_feature is
  'Optional short product suggestion. Testers are instructed not to include personal or health data.';
