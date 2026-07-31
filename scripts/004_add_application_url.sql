-- Add application_url field to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS application_url text;

-- Add a check constraint to ensure either contact_email or application_url is provided
-- (We'll handle this validation in the form instead since SQL constraints are complex for this case)
