-- Create jobs table for anonymous job postings
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  job_type text not null check (job_type in ('Full-time', 'Part-time', 'Contract', 'Freelance')),
  description text not null,
  requirements text,
  salary_range text,
  remote_friendly boolean default false,
  posted_at timestamp with time zone default now(),
  expires_at timestamp with time zone default (now() + interval '30 days'),
  contact_email text not null,
  is_active boolean default true
);

-- Create index for faster queries
create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);
create index if not exists jobs_is_active_idx on public.jobs (is_active);

-- Since this is anonymous posting, we don't need RLS
-- But we'll add a simple policy to allow anyone to read and insert
alter table public.jobs enable row level security;

-- Allow anyone to view active jobs
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (is_active = true);

-- Allow anyone to post jobs
create policy "Anyone can post jobs"
  on public.jobs for insert
  with check (true);
