-- Seed script to register the 60 pre-registered participants (264001 to 264060)
-- This creates Auth accounts and database profiles simultaneously without year constraints.

do $$
declare
  v_roll text;
  v_email text;
  v_uuid uuid;
  v_pw text;
begin
  for i in 1..60 loop
    v_roll := (264000 + i)::text;
    v_email := v_roll || '@design-event.com';
    v_pw := 'Pass_' || v_roll || '_Fest2026!';
    
    -- Check if user already exists in auth.users to prevent duplicate key errors
    select id into v_uuid from auth.users where email = v_email;
    
    if v_uuid is null then
      v_uuid := gen_random_uuid();

      -- 1. Insert into auth.users (Standard credentials)
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
    on conflict do nothing;

    -- 2. Insert or update the public profiles in participants table
    insert into public.participants (
      id,
      roll_number,
      name,
      status
    )
    values (
      v_uuid,
      v_roll,
      'Participant ' || v_roll,
      'pending'
    )
    on conflict (id) do update set
      roll_number = excluded.roll_number,
      name = excluded.name;
  end loop;
end $$;

-- Fix script for existing users missing auth identities
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

