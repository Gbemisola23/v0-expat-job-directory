-- Add RLS policies for UPDATE and DELETE operations
-- This allows admins (authenticated users) to update and delete jobs

-- Policy to allow authenticated users to update any job
CREATE POLICY "Authenticated users can update jobs"
ON jobs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy to allow authenticated users to delete any job
CREATE POLICY "Authenticated users can delete jobs"
ON jobs
FOR DELETE
TO authenticated
USING (true);

-- Also add policy to allow authenticated users to view all jobs (including inactive ones)
CREATE POLICY "Authenticated users can view all jobs"
ON jobs
FOR SELECT
TO authenticated
USING (true);
