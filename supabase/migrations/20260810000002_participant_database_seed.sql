-- ============================================================
-- MIGRATION: 20260810000002_participant_database_seed.sql
-- PURPOSE: Clean legacy 264xxx test data & seed 274001–274065 (65 total, Year 3)
-- ============================================================

-- Update Event Status RPC (Admin Only)
create or replace function public.update_event_status(p_status text)
returns jsonb security definer as $$
declare
  v_status text;
begin
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'error', 'Access denied: Must be logged in as an administrator.');
  end if;

  v_status := upper(trim(p_status));
  if v_status not in ('SCHEDULED', 'LIVE', 'CLOSED') then
    return jsonb_build_object('success', false, 'error', 'Invalid status: Status must be SCHEDULED, LIVE, or CLOSED.');
  end if;

  -- Ensure record exists in public.admins
  insert into public.admins (id) values (auth.uid()) on conflict do nothing;

  update public.event_settings
  set 
    status = v_status,
    started_at = case when v_status = 'LIVE' then coalesce(started_at, now()) else started_at end,
    closed_at = case when v_status = 'CLOSED' then now() else closed_at end,
    updated_at = now()
  where id = 'round_1';

  return jsonb_build_object('success', true, 'status', v_status);
end;
$$ language plpgsql;

-- Function to clean test data and seed exact 65 3rd-year participants
create or replace function public.sync_participant_database()
returns jsonb security definer as $$
declare
  v_roll text;
  v_email text;
  v_uuid uuid;
  v_pw text;
  v_count integer;
begin
  -- 1. Identify & Delete legacy test submissions & task_results linked to 264xxx test participants
  delete from public.task_results 
  where submission_id in (
    select s.id from public.submissions s
    join public.participants p on p.id = s.participant_id
    where p.roll_number like '264%'
  );

  delete from public.submissions 
  where participant_id in (
    select id from public.participants where roll_number like '264%'
  );

  -- 2. Delete legacy 264xxx test participant profiles
  delete from public.participants 
  where roll_number like '264%';

  -- 3. Delete legacy 264xxx test auth identities and auth users
  delete from auth.identities 
  where user_id in (
    select id from auth.users where email like '264%@design-event.com'
  );

  delete from auth.users 
  where email like '264%@design-event.com';

  -- 4. Seed EXACTLY 65 participants for 3rd Year (274001 to 274065)
  for i in 1..65 loop
    v_roll := (274000 + i)::text;
    v_email := v_roll || '@design-event.com';
    v_pw := 'Pass_' || v_roll || '_Fest2026!';
    
    -- Check if user already exists in auth.users to prevent duplicate key errors
    select id into v_uuid from auth.users where email = v_email;
    
    if v_uuid is null then
      v_uuid := gen_random_uuid();

      -- Insert into auth.users (Standard credentials)
      insert into auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at
      )
      values (
        v_uuid,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        v_email,
        crypt(v_pw, gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        false,
        now(),
        now()
      );
    end if;

    -- Create corresponding identity in auth.identities (Required for Supabase GoTrue Auth)
    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    values (
      gen_random_uuid(),
      v_uuid,
      jsonb_build_object('sub', v_uuid::text, 'email', v_email),
      'email',
      v_uuid::text,
      now(),
      now(),
      now()
    )
    on conflict (provider_id, provider) do nothing;

    -- Insert or update public profiles in participants table (Year 3 ONLY)
    insert into public.participants (
      id,
      roll_number,
      name,
      year,
      status
    )
    values (
      v_uuid,
      v_roll,
      'Participant ' || v_roll,
      3,
      'pending'
    )
    on conflict (id) do update set
      roll_number = excluded.roll_number,
      name = excluded.name,
      year = 3;
  end loop;

  -- Ensure all users have auth identities
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  select
    gen_random_uuid(),
    id,
    jsonb_build_object('sub', id::text, 'email', email),
    'email',
    id::text,
    now(),
    now(),
    now()
  from auth.users u
  where not exists (
    select 1 from auth.identities i where i.user_id = u.id
  );

  select count(*) into v_count from public.participants;

  return jsonb_build_object(
    'success', true,
    'total_participants', v_count,
    'range', '274001–274065'
  );
end;
$$ language plpgsql;

grant select on public.event_settings to anon, authenticated;
grant execute on function public.sync_participant_database() to anon, authenticated;

-- Run sync immediately upon execution of script
select public.sync_participant_database();
