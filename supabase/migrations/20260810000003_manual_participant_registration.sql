-- Migration: 20260810000003_manual_participant_registration.sql
-- Purpose: Add participant fields (year, department, email, phone, created_at) and RPC for manual registration

-- 1. Ensure columns exist on public.participants & fix restrictive year check constraint
alter table public.participants 
add column if not exists year integer default 2,
add column if not exists department text default null,
add column if not exists email text default null,
add column if not exists phone text default null,
add column if not exists created_at timestamp with time zone default now() not null;

-- Drop obsolete or restrictive year check constraint if present
alter table public.participants drop constraint if exists participants_year_check;
alter table public.participants add constraint participants_year_check check (year in (1, 2, 3, 4));

-- 2. Create unique index on roll_number if not already unique
create unique index if not exists idx_participants_roll_number_unique on public.participants (roll_number);

-- 3. Stored Procedure for Admin Manual Participant Registration
create or replace function public.register_participant(
  p_roll_number text,
  p_name text,
  p_year integer default 2,
  p_department text default null,
  p_email text default null,
  p_phone text default null
)
returns jsonb security definer as $$
declare
  v_roll text;
  v_name text;
  v_year integer;
  v_dept text;
  v_email text;
  v_phone text;
  v_uuid uuid;
  v_pw text;
  v_participant record;
begin
  -- 1. Trim & Format Inputs
  v_roll := upper(trim(coalesce(p_roll_number, '')));
  v_name := trim(coalesce(p_name, ''));
  v_year := coalesce(p_year, 2);
  v_dept := nullif(trim(coalesce(p_department, '')), '');
  v_email := nullif(trim(coalesce(p_email, '')), '');
  v_phone := nullif(trim(coalesce(p_phone, '')), '');

  -- 2. Basic Validation
  if v_roll = '' then
    return jsonb_build_object('success', false, 'error', 'Register Number is required.');
  end if;

  if v_name = '' then
    return jsonb_build_object('success', false, 'error', 'Participant Name is required.');
  end if;

  -- 3. Duplicate Register Number Check
  if exists (select 1 from public.participants where upper(roll_number) = v_roll) then
    return jsonb_build_object('success', false, 'error', 'Participant with Register Number "' || v_roll || '" is already registered.');
  end if;

  -- 4. Default Virtual Email format if no email supplied
  if v_email is null then
    v_email := lower(v_roll) || '@design-event.com';
  end if;

  -- 5. Create or Find Auth User
  select id into v_uuid from auth.users where lower(email) = lower(v_email);

  if v_uuid is null then
    v_uuid := gen_random_uuid();
    v_pw := 'Pass_' || v_roll || '_Fest2026!';

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
    ) values (
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

  -- 6. Ensure Auth Identity exists
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    v_uuid,
    jsonb_build_object('sub', v_uuid::text, 'email', v_email),
    'email',
    v_uuid::text,
    now(),
    now(),
    now()
  ) on conflict (provider_id, provider) do nothing;

  -- 7. Insert Into Public Participants Table
  insert into public.participants (
    id,
    roll_number,
    name,
    year,
    department,
    email,
    phone,
    status,
    created_at
  ) values (
    v_uuid,
    v_roll,
    v_name,
    v_year,
    v_dept,
    v_email,
    v_phone,
    'pending',
    now()
  ) returning * into v_participant;

  return jsonb_build_object(
    'success', true,
    'participant', row_to_json(v_participant)
  );
exception when others then
  return jsonb_build_object('success', false, 'error', SQLERRM);
end;
$$ language plpgsql;

-- 4. Permissions
grant execute on function public.register_participant(text, text, integer, text, text, text) to anon, authenticated;
