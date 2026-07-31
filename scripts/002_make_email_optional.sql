-- Make contact_email optional for anonymous posting
alter table public.jobs 
alter column contact_email drop not null;
