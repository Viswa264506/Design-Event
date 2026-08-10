-- Create Admins Table
create table public.admins (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default now() not null
);

-- Create Tasks Table (Public Details Only)
create table public.tasks (
    id text primary key,
    title text not null,
    instruction text not null,
    reference_asset text,
    max_points integer default 10 not null,
    public_config jsonb default '{}'::jsonb not null
);

-- Create Task Answers Table (Private details, never readable by participants)
create table public.task_answers (
    task_id text references public.tasks(id) on delete cascade primary key,
    target_layout jsonb not null
);

-- Create Participants Table
create table public.participants (
    id uuid references auth.users on delete cascade primary key,
    roll_number text unique not null,
    name text not null,
    year integer not null check (year in (2, 3)),
    started_at timestamp with time zone,
    submitted_at timestamp with time zone,
    final_score numeric(5,2) default 0.00 not null,
    status text default 'pending' not null check (status in ('pending', 'started', 'submitted'))
);

-- Create Submissions Table
create table public.submissions (
    id uuid default gen_random_uuid() primary key,
    participant_id uuid references public.participants(id) on delete cascade not null,
    design_json jsonb not null,
    total_score numeric(5,2) default 0.00 not null,
    submitted_at timestamp with time zone default now() not null,
    status text default 'submitted' not null check (status in ('submitted')),
    constraint unique_participant_submission unique (participant_id)
);

-- Create Task Results Table
create table public.task_results (
    id uuid default gen_random_uuid() primary key,
    submission_id uuid references public.submissions(id) on delete cascade not null,
    task_id text references public.tasks(id) on delete cascade not null,
    score numeric(5,2) not null,
    evaluation_details jsonb not null,
    constraint unique_submission_task unique (submission_id, task_id)
);

-- Enable Row Level Security
alter table public.admins enable row level security;
alter table public.tasks enable row level security;
alter table public.task_answers enable row level security;
alter table public.participants enable row level security;
alter table public.submissions enable row level security;
alter table public.task_results enable row level security;

-- SECURITY POLICIES --

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.admins where id = auth.uid()
  );
end;
$$ language plpgsql;

-- Admins Table Policies
create policy "Admins can do everything in admins"
    on public.admins for all to authenticated using (is_admin());

-- Tasks Policies
create policy "Allow read access to tasks for authenticated users"
    on public.tasks for select to authenticated using (true);

create policy "Admins can manage tasks"
    on public.tasks for all to authenticated using (is_admin());

-- Task Answers Policies
create policy "Admins can read/write task answers"
    on public.task_answers for all to authenticated using (is_admin());
-- Note: regular participants have NO read access policy for task_answers

-- Participants Policies
create policy "Participants can read their own record"
    on public.participants for select to authenticated using (auth.uid() = id);

create policy "Participants can update their own started_at and status when starting"
    on public.participants for update to authenticated using (
        auth.uid() = id
    ) with check (
        -- Can only change status from pending to started and record started_at once
        (old.status = 'pending' and new.status = 'started' and old.started_at is null and new.started_at is not null) or
        -- Or let Edge Function update score/submitted_at/status to submitted (using service_role, which bypasses RLS, so this policy doesn't need to allow it)
        is_admin()
    );

create policy "Admins can manage participants"
    on public.participants for all to authenticated using (is_admin());

-- Submissions Policies
create policy "Participants can insert their own submission if active"
    on public.submissions for insert to authenticated with check (
        auth.uid() = participant_id and
        exists (
            select 1 from public.participants p
            where p.id = auth.uid() 
            and p.status = 'started'
            and p.started_at is not null
            and now() <= p.started_at + interval '26 minutes' -- 25 min + 1 min buffer
        )
    );

create policy "Participants can read their own submission"
    on public.submissions for select to authenticated using (auth.uid() = participant_id);

create policy "Admins can manage submissions"
    on public.submissions for all to authenticated using (is_admin());

-- Task Results Policies
create policy "Participants can read their own task results"
    on public.task_results for select to authenticated using (
        exists (
            select 1 from public.submissions s
            where s.id = submission_id and s.participant_id = auth.uid()
        )
    );

create policy "Admins can manage task results"
    on public.task_results for all to authenticated using (is_admin());

-- CREATE INDEXES FOR PERFORMANCE --
create index idx_participants_roll_year on public.participants(year, roll_number);
create index idx_submissions_participant_id on public.submissions(participant_id);
create index idx_task_results_submission_id on public.task_results(submission_id);
