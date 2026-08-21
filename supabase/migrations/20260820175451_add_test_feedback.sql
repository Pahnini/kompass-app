create table if not exists public.test_feedback (
  id uuid primary key default gen_random_uuid(),
  category text not null
    constraint test_feedback_category_check
    check (category in ('general', 'bug', 'nova', 'accessibility', 'design')),
  rating smallint not null
    constraint test_feedback_rating_check
    check (rating between 1 and 5),
  device_type text not null
    constraint test_feedback_device_type_check
    check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  browser text not null
    constraint test_feedback_browser_check
    check (char_length(browser) between 1 and 80),
  message text not null
    constraint test_feedback_message_check
    check (char_length(btrim(message)) between 10 and 1500),
  completed_tasks text[] not null default '{}'::text[]
    constraint test_feedback_completed_tasks_check
    check (cardinality(completed_tasks) <= 10),
  app_version text not null default '0.1.0-test'
    constraint test_feedback_app_version_check
    check (char_length(app_version) between 1 and 30),
  created_at timestamptz not null default now()
);

comment on table public.test_feedback is
  'Data-minimal Melforia beta feedback. Stores no user id, email, chat transcript, or health data.';
comment on column public.test_feedback.browser is
  'Broad browser family only; never a complete user-agent string.';
comment on column public.test_feedback.completed_tasks is
  'Non-sensitive ids of optional product test tasks marked complete by the tester.';

alter table public.test_feedback enable row level security;

revoke all on table public.test_feedback from anon, authenticated;
grant insert on table public.test_feedback to authenticated;

drop policy if exists "Authenticated testers can submit feedback" on public.test_feedback;
create policy "Authenticated testers can submit feedback"
  on public.test_feedback
  for insert
  to authenticated
  with check ((select auth.uid()) is not null);
