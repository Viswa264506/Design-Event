-- Alter participants table to add active_session_id
alter table public.participants 
add column if not exists active_session_id uuid default null;

-- Atomic participant login verification function (no year parameters or ranges required)
create or replace function public.authenticate_participant(p_roll_number text)
returns jsonb security definer as $$
declare
  v_participant record;
  v_session_id uuid;
begin
  -- 1. Format/validate roll number format
  p_roll_number := upper(trim(p_roll_number));
  
  if p_roll_number = '' then
    return jsonb_build_object('success', false, 'error', 'Invalid roll number: Please enter a valid registration roll number.');
  end if;

  -- 2. Check if participant exists in the database (Pre-registered constraint)
  -- Perform Row Lock SELECT FOR UPDATE to prevent race conditions on concurrent authentications
  select * into v_participant 
  from public.participants 
  where roll_number = p_roll_number 
  for update;
  
  if not found then
    return jsonb_build_object('success', false, 'error', 'Not registered: This roll number is not registered for this event.');
  end if;

  -- 3. Check if already completed
  if v_participant.status = 'submitted' or v_participant.submitted_at is not null then
    return jsonb_build_object('success', false, 'error', 'Already completed: You have already completed Round 1.');
  end if;

  -- 4. Check if session is already active on another device
  if v_participant.active_session_id is not null then
    return jsonb_build_object('success', false, 'error', 'Already active: This roll number is already active on another device.');
  end if;

  -- 5. Atomic session creation
  v_session_id := gen_random_uuid();
  update public.participants
  set 
    active_session_id = v_session_id,
    started_at = coalesce(started_at, now()), -- set started_at if not set (re-connection preserves original start time!)
    status = 'started'
  where id = v_participant.id;

  return jsonb_build_object(
    'success', true, 
    'session_id', v_session_id, 
    'user_id', v_participant.id,
    'started_at', coalesce(v_participant.started_at, now())
  );
end;
$$ language plpgsql;

-- Release session helper function
create or replace function public.release_participant_session(p_user_id uuid)
returns void security definer as $$
begin
  update public.participants
  set active_session_id = null
  where id = p_user_id;
end;
$$ language plpgsql;

-- Grant execution to public client roles
grant execute on function public.authenticate_participant(text) to anon, authenticated;
grant execute on function public.release_participant_session(uuid) to anon, authenticated;
