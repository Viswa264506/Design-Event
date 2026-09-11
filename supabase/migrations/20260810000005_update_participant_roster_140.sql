-- ============================================================
-- MIGRATION: 20260810000005_update_participant_roster_140.sql
-- PURPOSE: Update participant roster to 140 participants:
--          Batch 1: 274001 to 274070 (70 participants)
--          Batch 2: 284001 to 284070 (70 participants)
-- ============================================================

create or replace function public.sync_participant_database()
returns jsonb security definer as $$
declare
  v_roll text;
  v_email text;
  v_uuid uuid;
  v_pw text;
  v_count integer;
  v_year integer;
begin
  -- Loop over Batch 1 (274001 to 274070) and Batch 2 (284001 to 284070)
  for b in 1..2 loop
    v_year := 3;
    
    for i in 1..70 loop
      v_roll := case when b = 1 then (274000 + i)::text else (284000 + i)::text end;
      v_email := lower(v_roll) || '@design-event.com';
      v_pw := 'Pass_' || v_roll || '_Fest2026!';

      -- Check if user already exists in auth.users
      select id into v_uuid from auth.users where email = v_email;

      if v_uuid is null then
        v_uuid := gen_random_uuid();

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

      -- Create corresponding identity in auth.identities
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

      -- Insert into public.participants WITHOUT overwriting existing active/submitted/score/session state if present
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
        v_year,
        'pending'
      )
      on conflict (roll_number) do nothing;
    end loop;
  end loop;

  -- Ensure all users in auth.users have matching auth.identities
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
    'range', '274001–274070 & 284001–284070'
  );
end;
$$ language plpgsql;

grant execute on function public.sync_participant_database() to anon, authenticated;
