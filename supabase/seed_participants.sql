-- Seed script to register the 60 Year-2 participants (264001 to 264060)
-- This creates Auth accounts and database profiles simultaneously.

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

    -- 2. Insert or update the public profiles in participants table
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
      2,
      'pending'
    )
    on conflict (id) do update set
      roll_number = excluded.roll_number,
      name = excluded.name,
      year = excluded.year;
  end loop;
end $$;
