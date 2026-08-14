-- Migration: 20260810000004_clear_legacy_seeded_participants.sql
-- Purpose: Remove old pre-seeded dummy participants (274001–274065 & 264xxx) to allow a fresh empty participant roster for manual admin registration.

create or replace function public.clear_all_participants()
returns jsonb security definer as $$
declare
  v_count integer;
begin
  -- 1. Delete task results linked to legacy participants
  delete from public.task_results 
  where submission_id in (
    select id from public.submissions
  );

  -- 2. Delete all submissions
  delete from public.submissions;

  -- 3. Delete all participants
  delete from public.participants;

  -- 4. Delete seeded auth identities
  delete from auth.identities 
  where user_id in (
    select id from auth.users where email like '%@design-event.com'
  );

  -- 5. Delete seeded auth users
  delete from auth.users 
  where email like '%@design-event.com';

  select count(*) into v_count from public.participants;

  return jsonb_build_object(
    'success', true,
    'total_participants', v_count
  );
end;
$$ language plpgsql;

grant execute on function public.clear_all_participants() to anon, authenticated;

-- Run clear immediately to purge pre-seeded test data
select public.clear_all_participants();
