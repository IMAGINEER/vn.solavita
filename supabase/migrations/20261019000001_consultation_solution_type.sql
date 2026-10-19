-- ============================================================
-- Add `solution_type` to `consultation_leads`.
--
-- Captures the new Step-1 answer from the 4-step consultation form
-- ('home' | 'business' | 'exploring') so NG leads are routed
-- correctly downstream. The column is NULL-able and has no default,
-- so existing UK/IT rows are unaffected and their code paths
-- continue to work without writing to it.
--
-- This is the only column change. All other consultation_leads
-- columns (salutation, name, email, phone, address, region,
-- house_type, roof_type, household_size, electricity_usage,
-- devices, generator_frequency, fuel_budget_ngn, backup_needs,
-- plan_token, plan_*_at, country, created_at, updated_at) are
-- untouched. UK/IT projects can keep using their existing payload
-- shape — no UK/IT route needs to be modified.
-- ============================================================

ALTER TABLE public.consultation_leads
  ADD COLUMN IF NOT EXISTS solution_type TEXT;

-- Permissive CHECK so NG-only values 'home' / 'business' / 'exploring'
-- are accepted while still allowing NULL (UK/IT rows) and any future
-- value UK/IT might add. NOT VALID applies the constraint to new
-- rows only so historical UK/IT rows aren't validated.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'consultation_leads_solution_type_check'
      AND conrelid = 'public.consultation_leads'::regclass
  ) THEN
    ALTER TABLE public.consultation_leads
      ADD CONSTRAINT consultation_leads_solution_type_check
      CHECK (
        solution_type IS NULL
        OR solution_type IN ('home', 'business', 'exploring')
      ) NOT VALID;
  END IF;
END $$;

-- Optional index for filtering by solution type in admin views.
CREATE INDEX IF NOT EXISTS idx_consultation_leads_solution_type
  ON public.consultation_leads(solution_type)
  WHERE solution_type IS NOT NULL;
